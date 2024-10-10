import tempfile
import threading
import json
from selenium import webdriver
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.chrome.options import Options
from logger import Logger
from urllib.parse import quote
from datetime import datetime
from tweet import Tweet
from app import stop_flag

global_counter = 0
counter_lock = threading.Lock()

def main(conf, log, keyword, start_date, end_date, lang, num, n):
    log.warning("Loading configurations...")
    start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
    end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
    date_ranges = divide_date_range(start_date, end_date, n)
    threads = []
    temp_files = []
    for i in range(n):
        start_part_date, end_part_date = date_ranges[i]
        temp_files.append(tempfile.NamedTemporaryFile(
            mode='w', delete=False).name)
        thread = threading.Thread(
            target=run_driver, args=(conf, log, temp_files[i], keyword, start_part_date, end_part_date, lang, num/n, n))
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()

    merge_temp_files(temp_files)


def divide_date_range(start_date, end_date, n_parts):
    if isinstance(start_date, str):
        start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
    if isinstance(end_date, str):
        end_date = datetime.strptime(end_date, "%Y-%m-%d").date()

    total_duration = end_date - start_date

    part_duration = total_duration // n_parts

    date_ranges = [(start_date + part_duration * i, start_date + part_duration * (i + 1))
                   for i in range(n_parts)]

    date_ranges[-1] = (date_ranges[-1][0], end_date)

    return date_ranges


def run_driver(conf, log, temp_file, keyword, start_date, end_date, lang, num, n):
    try:
        driver = open_driver(conf["headless"], conf["userAgent"])
        driver.get("https://twitter.com/home")
        set_token(driver, conf["token"])
        driver.get("https://twitter.com/home")

        profile_search(log, driver, temp_file, keyword,
                       start_date, end_date, lang, num, n)
    except WebDriverException as e:
        log.error(f"Error accessing Twitter: {str(e)}")
    finally:
        if driver:
            driver.quit()


def profile_search(log, driver: webdriver.Chrome, temp_file, keyword, start_date, end_date, lang, num, n):
    try:
        encoded_keyword = quote(keyword, safe='')
        global global_counter
        url = f"https://twitter.com/search?q=until%3A{end_date}%20since%3A{start_date}%20{encoded_keyword}%20lang%3A{lang}&f=live"
        driver.get(url)

        log.warning("Fetching...")
        Ad = []
        results = []
        while len(results) < num and stop_flag.get_flag() == False:
            tweet = Tweet(driver, Ad)

            data = {}

            data["URL"] = tweet.get_url()
            data["Date"] = tweet.get_date()
            data["Text"] = tweet.get_text()
            data["Lang"] = tweet.get_lang()
            data["Likes"] = tweet.get_num_likes()
            data["Retweets"] = tweet.get_num_retweet()
            data["Replies"] = tweet.get_num_reply()

            results.append(data)

            with counter_lock:
                global_counter += 1
            tweet_number = global_counter

            log.info(f"{tweet_number} : {data['URL']}")

            write_to_temp_file(results, temp_file)
    except WebDriverException as e:
        log.error(f"Error accessing Twitter: {str(e)}")


def write_to_temp_file(data, temp_file):
    # Write the data to the temporary file
    with open(temp_file, 'w') as file:
        json.dump(data, file)


def merge_temp_files(temp_files):
    merged_data = []

    # Read data from each temporary file and merge into merged_data
    for temp_file in temp_files:
        with open(temp_file, 'r') as file:
            data = json.load(file)
            merged_data.extend(data)

    # Write merged data into final JSON file
    with open("../python/twitter/files/temp.json", "w") as final_file:
        json.dump(merged_data, final_file)


# Rest of your code remains unchanged


def open_driver(headless: bool, agent: str) -> webdriver.Chrome:
    options = Options()

    options.add_argument('--log-level=3')
    options.add_argument('ignore-certificate-errors')
    options.add_argument('--disable-gpu')
        
    if headless:
        options.add_argument('--headless')

    options.add_argument(f"user-agent={agent}")

    driver = webdriver.Chrome(options=options)

    return driver


def set_token(driver: webdriver.Chrome, token: str) -> None:
    src = f"""
            let date = new Date();
            date.setTime(date.getTime() + (7*24*60*60*1000));
            let expires = "; expires=" + date.toUTCString();

            document.cookie = "auth_token={token}"  + expires + "; path=/";
        """
    driver.execute_script(src)


def load_conf() -> dict:
    with open("../python/twitter/files/conf.json", "r") as file:
        return json.loads(file.read())
