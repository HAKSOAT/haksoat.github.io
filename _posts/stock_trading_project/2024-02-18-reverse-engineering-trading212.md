---
title:  "I Reverse-Engineered Trading212's Web APIs"
last_modified_at: 2024-02-18T01:20:02+01:00
header:
  teaser: http://res.cloudinary.com/haks/image/upload/v1708288153/HAKSOAT_Blog/reverse-engineering-trading212/tradingTOT-teaser.png
  overlay_image: http://res.cloudinary.com/haks/image/upload/v1700337803/HAKSOAT_Blog/openbb-experience/openbb-skies.webp
  caption: "Photo credit: [**DALL-E**](https://openai.com/dall-e-3)"
excerpt: "I reverse-engineered Trading212's web APIs, then built a Python package for programmatic trading on the platform."
tags:
  - stock-trading-project
---

Hi there, this is the third article I am writing from the [learning about stock trading with python]({{ site.url }}/learning-stock-trading-python/) series. 
In this article, I write about my experience reverse-engineering Trading212's APIs and building a [custom Python package](https://github.com/HAKSOAT/tradingTOT) for placing trades using Trading212. 
You may wonder, why do this rather than use something off the shelf? This leads me to the first part of this article; the backstory.

# The Backstory

In the [What Goes Into Building a Trading System]({{ site.url }}/building-trading-system/#a-broker) article, I wrote about my experience trying to find a broker for placing trades but struggling to find one. 
I had done some research about various platforms, including trying to use Interactive Brokers. However, Trading212 seemed to be an easy-to-use trading platform with zero commission fees and a user-friendly interface. 
Hence, I set out to learn more about what they had to offer in terms of APIs and the ability to place trades programmatically.

# Trading212 Clients

The platform offers its product to customers across different platforms, including the web and mobile platforms. I came across some news on their forum about [the availability of a beta API for testing purposes](https://community.trading212.com/t/new-equity-trading-api-in-beta-try-it-out-in-practice-mode/61788) and the thread links to an [API documentation](https://t212public-api-docs.redoc.ly/) too. 
On going through the thread, I noticed the API does not work in live trading scenarios and is far from stable. NB: On doing one more check while writing this article, I saw they made the API [accessible to live account users](https://community.trading212.com/t/new-equity-trading-api-in-beta-try-it-out-in-practice-mode/61788/37) at some point, but [further development remains paused](https://community.trading212.com/t/new-equity-trading-api-in-beta-try-it-out-in-practice-mode/61788/143).

I also came across a couple of unofficial Trading212 Python packages such as [Trading212API](https://github.com/BenTimor/Trading212API/) for programmatically buying and selling on the platform. Sadly, it was broken, and it didn't seem like a good idea trying to fix it (maybe I was itching to build something myself too).

![Screenshot of Trading212 API Pause](http://res.cloudinary.com/haks/image/upload/v1708180415/HAKSOAT_Blog/reverse-engineering-trading212/trading212-api-pause.png){: .align-center}
A conversation on the Trading212 forum about the pause on API development.
{: .text-center}


# Studying the APIs

Behind every web application are API calls that make the functionalities work. Where each API endpoint can be considered as some sort of LEGO block, and one can combine the various blocks to get a final product. When looking to build a package such as the one I write about in this article, it is necessary to see how the endpoints correlate. 

While it is not my first time reverse-engineering web APIs, something I found interesting was that many endpoints were reliant on calling `/rest/v1/webclient/authenticate` first. Where such a call was missing, I got errors relating to lack of authentication.

Some kudos to the engineering by Trading212, I noticed that the demo environment was some mirror of the live environment. Hence, after confirming that things were working as expected in demo, all I did was to substitute a variable and start operating in a real environment. For context, I had urls written in a way similar to `f"https://{environment}.trading212.com/rest/v1/webclient/authenticate"`, where environment can be `live` or `demo`.

I also noticed their use of Algolia for their search functionality and the Algolia API was being called for endpoints relating to equities. Therefore, I needed to understand how to extract the application id and the `x-algolia-api-key` they use, which was accessible through Devtools. 

While it was a good thing that I could access such data from studying the APIs, I wonder, aren’t there risks of storing the key like that? If you are a frontend person, do chime in with your thoughts on if there is a better way to go about this from an engineering and security perspective.

On understanding these behaviours, I sought to find the other endpoints that influenced the behaviours I was hoping to control. Some of them include:

- `/rest/v1/equity/value-order/validate`: To check if an order is valid. This endpoint is to be used before placing the actual order call.
- `/rest/v1/equity/value-order/review`: To view the costs of placing the order.
- `/rest/v1/equity/value-order`: To actually place the order.
- `/rest/trading/v1/accounts/summary`: To check for placed orders. It also returns the cash and value summary of a trader's account.

It was quite fun to see how the APIs integrate to make Trading212 usable for the web user. Do note that this is not the first time I am reverse-engineering web APIs. I have done something similar with platforms like Rightmove, Zoopla and even [built a custom web application](https://github.com/HAKSOAT/Bittimi/blob/main/utils.py) on reverse-engineering [Bitrefill](https://www.bitrefill.com/gb/en/).

![TradingTOT demo](http://res.cloudinary.com/haks/image/upload/v1708181253/HAKSOAT_Blog/reverse-engineering-trading212/tradingTOT-demo.gif){: .align-center}

A TradingTOT package demo.
{: .text-center}

# Some Interesting Ideas

After understanding how the APIs interacted, I moved on to build [the Trading212 package](https://github.com/HAKSOAT/tradingTOT) that I would go on to use in the basic trading system I was working on. 
While doing this, I came across and applied some interesting ideas, and I would like to share them in this section.

- Devtools Preserve Log
- Selenium Plus Python Requests
- Enforce Auth as a Decorator
- Selenium Stealth
- Selenium ActionChains
- Converting JSON to Pydantic Models using ChatGPT

## Devtools Preserve Log

When looking to reverse engineer APIs, it is important to understand the flow of various API calls. Many web browsers provide the "preserve log" functionality; it helps keep the logs across multiple page loads. 
Sadly, this feature is disabled by default and if you are unaware of its availability, you will end up missing out on the edge it offers.

One use case for me was in situations where there was a new page being loaded after clicking a certain button. This meant was that before I could go through the various API calls resulting from the click, a new page was loaded and the logs are refreshed. 
Interestingly, I only got to know about this feature on this project and I have always studied API calls without it, but I guess the need for preserving logs got me to find out about it.

![Preserve Log Checkbox](https://res.cloudinary.com/haks/image/upload/v1708180613/HAKSOAT_Blog/reverse-engineering-trading212/preserve-log.png){: .align-center}

A screenshot of the preserve log checkbox.
{: .text-center}

## Combining Selenium and Python Requests

In this project, I was hoping to do everything without Selenium as I was concerned about the overhead that comes along with it. However, I was not successful with this because I could not figure what API Trading212 was using to send email and password to the backend. In the end, I used Selenium to extract something Trading212 calls a `LOGIN_TOKEN` and also to extract the parts of the header crucial to making an API call.

On getting these values, I updated the headers and cookies in a `requests.Session` object. The implication of this is that from that point on, I could use Python's Requests package to send the API requests. Using Selenium to extract credentials in the first stage was unpleasant despite it being a onetime process, but this shows it is possible to use both tools in the same workflow.

The workflow looks something like:

{% highlight python %}
driver = load_driver()
driver = login_trading212(driver, os.environ.get("TRADING212_EMAIL"),
                          os.environ.get("TRADING212_PASSWORD"))
headers = generate_headers(driver)
auth_cookies = {'LOGIN_TOKEN': get_login_token(driver)}
driver.close()
session = requests.Session()
session.headers.update(headers)
session.cookies.update(auth_cookies)
session.post(ACCOUNT_SUMMARY_URL, json=[]).json()
{% endhighlight %}

## Enforce Auth as a Decorator

Earlier, I talked about some endpoints relying on an initial call of the `/rest/v1/webclient/authenticate` endpoint. I did not want to bake the authentication call into the functions that make those calls, so I chose to use a decorator to extend them.

In Python, the concept of a decorator is a function that extends the behaviour of another function it receives without modifying the contents of this received function. It does this by wrapping the contents of the received function in the extra behaviour.

A basic Python decorator looks something like this:

{% highlight python %}
def my_decorator(func):
    def wrapper(*args, **kwargs):
        # Do something before the function call
        result = func(*args, **kwargs)
        # Do something after the function call
        return result
    return wrapper
{% endhighlight %}

The decorator I came up with looks something like this:

This decorator looked something like:

{% highlight python %}
from functools import wraps

def enforce_auth(func: Callable):
    @wraps(func)
    def wrapper(*args, **kwargs):
        instance = kwargs.get("self", args[0])

        try:
            auth_response = instance.session.get(AUTHENTICATE_URL)
            is_auth = True if auth_response.status_code == 200 else False
        except ConnectionError:
            is_auth = False

        while not is_auth:
            login_and_update_cookies()

        if kwargs.get("self"):
            kwargs["self"] = instance
        else:
            args = list(args)
            args[0] = instance
            args = tuple(args)

        return func(*args, **kwargs)
{% endhighlight %}

Here extraction of the `self` argument is because the decorator is being used on instance methods. Hence, the instance is being modified after the extended functionality of the decorator is applied. 
You may notice the use of the `wraps` decorator function from `functools`. When a decorator is used, it alters the original function, hence a call like `help(original_function)` will only return the docstring from the altered function. This is likely undesirable behaviour and can make life hard for IDEs and when debugging. `wraps` ensures that the metadata returned is that of the original function rather than the altered one.

Below is an example application of this decorator:

{% highlight python %}
@enforce_auth
def get_account_details(self) -> Dict:
    """Get the value of assets in account."""
    response = self.session.post(ACCOUNT_SUMMARY_URL, json=[]).json()
    details = {
        "cash": response.get("cash").get("freeForStocks"),
        "total": response.get("cash").get("total")
    }

    return details
{% endhighlight %}

By applying this `enforce_auth` decorator, the authenticate endpoint is always called before any attempt to extract the account details. I have always used decorators from third-party libraries and frameworks, but it was nice to have a use case to create one myself.

## Selenium Stealth

As I mentioned earlier, I used Selenium to log in to Trading212 before extracting the login token. All of this worked properly when using Selenium in its default configuration. However, this does not provide a good user experience for a package as Selenium will try to spin up an interactive browser. Imagine calling `tradingTOT().get_account_details()` and having a browser triggered, not good. So I decided to use Selenium's headless mode and to my dismay, I was greeted with an access denied error. I did some research about this and came across Selenium Stealth. It turns out that [Selenium has some indicators](https://stackoverflow.com/questions/33225947/can-a-website-detect-when-you-are-using-selenium-with-chromedriver) that web platforms often check to detect automated clients. Selenium Stealth makes it harder to detect the browser in automated mode.

It is also quite easy to use, one call wrapping Selenium's `Driver` object is all that is needed.

{% highlight python %}
stealth(driver, languages=["en-US", "en"],
        vendor="Google Inc.", platform="Win32",
        webgl_vendor="Intel Inc.", renderer="Intel Iris OpenGL Engine",
        fix_hairline=True)
{% endhighlight %}

One thing to note is that Selenium Stealth only supports Google Chrome. Hence, while tradingTOT supports Microsoft Edge and Safari too, Chrome is encouraged as it increases the chances of a smooth execution.

## Selenium ActionChains

Before working on this project, I knew about the `ActionChains` class, but I did not quite understand the use case. 
Previously, I observed that whenever I tried to perform some automation tasks such as clicking and it did not work; I used `ActionChains` and it worked.
Why exactly, this was the case, I was not sure.

However, on this project, while trying to emulate a user behaviour before login, it all clicked.

Below is a sample use case:

```python
login_action = ActionChains(driver)

password_input = driver.find_element(
    By.XPATH, "//input[@name='password' and @type='password']"
)
login_action.move_to_element(
    password_input).click(
    password_input).send_keys(password).pause(0.1)

login_button = driver.find_element(
    By.XPATH, "//input[@type='submit' and @value='Log in']"
)
login_action.move_to_element(
    login_button).click(login_button).pause(0.1)

login_action.perform()
```

It occurred to me that `ActionChains` is a great way to combine multiple actions, such that you can decide when to execute with the `perform` method.
From the code sample above, I can simulate the mouse moving to various elements, sending keys, pausing before the next action. 
If I am to do this without `ActionChains`, it would be:

```python
password_input = driver.find_element(
    By.XPATH, "//input[@name='password' and @type='password']"
)
password_input.send_keys(password)

time.sleep(0.1)

login_button = driver.find_element(
    By.XPATH, "//input[@type='submit' and @value='Log in']"
)
login_button.click()
```

This approach:

1. will not automate the mouse movements 
2. does not have a pause mechanism as it relies on Python `time.sleep`
3. can become messy especially if multiple complex actions are necessary

I will keep using `ActionChains` going forward for my automation tasks. In the previous example, you can see how I created `login_action` action chain. 
If I need other complex actions such as reset password, sign up, I can create separate action chains for them and execute using `perform`.

## Converting JSON to Pydantic Models using ChatGPT

When working on this package, one of my main concerns was: 

> If Trading212 changes something in the API, what is the safest and fastest way to know?

My answer to this was: 

1. Build Pydantic classes from the API responses
2. Use those Pydantic classes in tests
3. Run such tests frequently
4. Plug in notifications at the end of test runs

This means that whenever the API breaks, there will be an awareness of this breaking change. Not to go into the details of the tests as I am more interested in talking about one use case of ChatGPT I came across.
I gave ChatGPT the API responses I was looking to generate Python classes from, for example:

{% highlight json %}
{
    "cash": {
        "free": "VALUE",
        "total": "VALUE",
        "interest": "VALUE",
        ...
        "blockedForStocks": "VALUE",
        "pieCash": "VALUE"
    },
    "open": {
        "unfilteredCount": "VALUE",
        "items": [
            {
                "positionId": "ID1",
                "humanId": "ID1",
                "created": "DATE",
                ...
                "maxBuy": "VALUE",
                "maxSell": "VALUE",
                "maxOpenBuy": "VALUE",
                "maxOpenSell": "VALUE",
            },
        ]
    },
    ...
}
{% endhighlight %}

I was impressed to see that it did a good job of generating the classes. Here are the classes it generated, matching the example above:

{% highlight python %}
class Position(BaseModel):
    positionId: str
    humanId: str
    created: str
    ...
    maxBuy: float
    maxSell: float
    maxOpenBuy: float
    maxOpenSell: float


class Open(BaseModel):
    unfilteredCount: int
    items: List[Position]


class Cash(BaseModel):
    free: float
    total: float
    interest: float
    ...
    blockedForStocks: float
    pieCash: int
{% endhighlight %}

On getting the classes generated, I made modifications such as setting default values where I deemed fit. 
After this, I parse responses gotten from sending HTTP requests, using the generated Pydantic classes.

For example, here is how I parse the response on calling the summary endpoint:

{% highlight python %}
response = session.post(ACCOUNT_SUMMARY_URL, json=[]).json()
SummarySchema.model_validate(response)
{% endhighlight %}

If at any point the resulting json from the API call changes, the `model_validate` call fails with pointers to the attributes not meeting the requirements.
Aside from this making it easy to trust the tests, it also makes it easy to know what changed in the response and a hint of what to change in the package's logic to keep things working as expected.

I have an idea to make use of ChatGPT to generate code fixes and a corresponding PR when such breaking changes happen. If I ever get to it, I will definitely be writing an article on it.


# Conclusion

Trading212 does not provide an API that enables the programmatic trading of equities, outside CFDs. Hence, I dug deep to reverse-engineer the APIs and build something for [my use case]({{ site.url }}/learning-stock-trading-python/). In this article, I wrote about how I went about building a [custom Python package](https://github.com/HAKSOAT/tradingTOT) for placing trades using Trading212. 
I also wrote briefly about some cool things I came across along the way, such as Selenium Stealth and the use case of using ChatGPT to generate Pydantic models from JSON files.
If you have a project where you are looking to reverse-engineer web APIs and feel free to [reach out to me on LinkedIn](https://linkedin.com/in/habeebshopeju).

Next steps for me will be to plug this package into my existing [Backtrader](https://www.backtrader.com/) setup and use in trading algorithms, demo environments then slowly transitioning to the live environments. 
On the side, I will gradually clean up and add more documentation to the package, then publish on PyPi, so it is easily accessible by others.

Side note: From writing [my last article on OpenBB]({{ site.url }}/openbb-experience/), I got some feedback on how it is possible to purchase stocks using MQL5. However, on checking the website, I do not quite understand how to go about this. So if you read till this point and have used MQL5 to trade stocks, please help me out.