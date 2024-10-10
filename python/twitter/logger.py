from datetime import datetime


class Logger:
    def success(self, text, time=True):
        cprint(f"{get_time() if time else ''}{text}")
        fprint(f"{get_time() if time else ''}{text}")

    def info(self, text, time=True):
        cprint(f"{get_time() if time else ''}{text}")
        fprint(f"{get_time() if time else ''}{text}")

    def warning(self, text, time=True):
        cprint(f"{get_time() if time else ''}{text}")
        fprint(f"{get_time() if time else ''}{text}")

    def error(self, text, time=True):
        cprint(f"{get_time() if time else ''}{text}")
        fprint(f"{get_time() if time else ''}{text}")

    def end(self, color="white", num=20):
        cprint(("-" * num), color)


def fprint(text):
    with open("../python/twitter/files/file.log", "a") as f:
        f.write(f"{text}\n")


def cprint(text, end="\n"):
    print(text, end=end)


def get_time():
    time = datetime.now()
    formated_time = time.strftime("%d/%m/%Y %H:%M:%S: ")
    return formated_time