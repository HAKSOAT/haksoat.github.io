---
title:  "I Built a Trading212 Package"
last_modified_at: 2023-11-18T01:20:02+01:00
header:
  teaser: http://res.cloudinary.com/haks/image/upload/v1700336912/HAKSOAT_Blog/openbb-experience/openbb-asset.png
  overlay_image: http://res.cloudinary.com/haks/image/upload/v1700337803/HAKSOAT_Blog/openbb-experience/openbb-skies.webp
  caption: "Photo credit: [**DALL-E**](https://openai.com/dall-e-3)"
excerpt: "A review of OpenBB and my experience using it."
tags:
  - stock-trading
---

Hi there, this is the third article I am writing from the [learning about stock trading with python](https://haksoat.com/learning-stock-trading-python/) series. In this article, write about my experience building a custom Python package for placing trades using Trading212. You may wonder why do this rather than something off the shelf, so this leads me to the first part of this article; the backstory.

# The Backstory

In the [What Goes Into Building a Trading System](https://haksoat.com/building-trading-system/#a-broker) article, I wrote about my experience trying to find a broker for placing trades but struggling to find one. I had done some research about various platforms, trying Interactive Brokers in the process. However, Trading212 seemed to be an easy-to-use trading platform with zero commission fees and a user-friendly interface. Hence, I set out to learn more about what they had to offer in terms of APIs and the ability to place trades programmatically.

# Trading212 Clients

The platform is offered to customers across different platforms, including the web and mobile platforms. However, I did not notice the availability of a well-documented Trading212 client that makes it possible to place trades. I came across a couple of unofficial Trading212 Python packages such as [Trading212API](https://github.com/BenTimor/Trading212API/) that made a promise of being able to programmatically buy and sell on the platform. Sadly, they always ended up being broken in some way. Since I had already had the intention 

While writing this article, I came across some news on their forum about [the availability of a beta API for testing purposes](https://community.trading212.com/t/new-equity-trading-api-in-beta-try-it-out-in-practice-mode/61788) and the thread links to an [API documentation](https://community.trading212.com/t/new-equity-trading-api-in-beta-try-it-out-in-practice-mode/61788) too. On going through the thread, I noticed the API does not work in live trading scenarios and is far from stable. Given this situation, I decided to get into the weeds and build something for myself.

# Studying the APIs

Behind every web application are API calls that make the functionalities work. Where each API endpoint can be considered some sort of lego block that can be combined with others to get the final object. When looking to build a package such as the one I write about in this article, it is necessary to see how the endpoints correlate. 

While it is not my first time reverse-engineering web apis, something I found interesting was that many endpoints were dependent on calling `/rest/v1/webclient/authenticate` first. In the cases where such a call was not made, I got errors relating to lack of authentication. Note that this is different from the log-in process.

Some kudos to the engineering by Trading212, I noticed that the practice environment was some mirror of the live environment. All the functionality from the practice environment is similar to the live one. Hence, after confirming that things were working as expected in demo, all I needed to do was switch a variable and start operating in a real environment. So I had urls written in a way similar to `f"https://{environment}.trading212.com/rest/v1/webclient/authenticate"`.

I noticed their use of Algolia for storing information relating to equities. So I needed to understand how to extract the application id and the `x-algolia-api-key` that Trading212 use for Algolia. While it was a good thing for me that I was able to access such data from studying the APIs, I wonder if it is a good thing that a key like that is accessible in such a manner. If you are a frontend person, do chime in with your thoughts on if there is a better way to go about this from an engineering and security perspective.

On understanding these behaviours, I sought to find the other endpoints that influencing the behaviours I was hoping to control. Some of them include:

- `/rest/v1/equity/value-order/validate`: To check if an order is valid. This endpoint is to be used before placing the actual call.
- `/rest/v1/equity/value-order/review`: To view the costs of placing the order.
- `/rest/v1/equity/value-order`: To actually place the order.
- `/rest/trading/v1/accounts/summary`: To check for placed orders and can also be used to get the cash and value summary of a trader's account.

It was quite fun to see how the APIs are combined to make Trading212 usable for the web user. Do note that this is not the first time I am reverse-engineering web apis. I have done something similar with platforms like Rightmove, Zoopla and even [built a custom web application](https://github.com/HAKSOAT/Bittimi/blob/main/utils.py) on reverse-engineering [Bitrefill](https://www.bitrefill.com/gb/en/).


# Some Interesting Ideas

After understanding how the APIs interacted, I moved on to build the Trading212 package that I would go on to use in the basic trading system I was working on. While doing this, I came across and applied some interesting ideas, and I would like to share them in this section.

- Devtools Preserve Log
- Selenium Plus Python Requests
- Enforce Auth as a Decorator
- Selenium Stealth
- Converting JSON to Pydantic Models using ChatGPT

## Devtools Preserve Log

When looking to reverse engineer APIs, it is important to understand the flow of various API calls. Many web browsers provide the "preserve log" functionality such that the same log can be kept across multiple web pages. Sadly, this feature is always disabled by default and if you are unaware of its availability, may be missing out on the edge it offers.

One use case for me was in situations where there was a new page being loaded after clicking a certain button. What this meant was that before I could go through the various API calls resulting from the click, a new page was loaded and the logs are refreshed. Interestingly, I only got to know about this feature on this project and I have always studied API calls without it, but I guess the need for preserved logs got me to find out about it.

## Combining Selenium and Python Requests

In this project, I was hoping to do everything without making use of Selenium as I was concerned about the overhead that it brings along with it. However, I was not successful with this because I could not figure what API Trading212 was using to send email and password to the backend. In the end, I used Selenium to extract something Trading212 calls a `LOGIN_TOKEN` and also to extract the parts of the header crucial to making an API call.

On getting these values, I updated the headers and cookies in a `requests.Session` object. The implication of this is that from that point on, I could use Python's Requests package to send the API requests. The use of Selenium to extract credentials in the first stage was unpleasant despite it being a one-time process, but this shows it is possible to use both tools in the same workflow.

This can be illustrated through the code below:

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
instance.session = session
{% endhighlight %}

## Enforce Auth as a Decorator

In Python, the concept of a decorator is a function that extends the behaviour of a function it receives without modifying the contents of this function. It does this by wrapping the contents of the function it receives in the extra behaviour.

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

In my usecase, I decided to make use of decorator in enforcing the authentication of the Trading212 token on noticing that certain calls always required an API call to the authenticate endpoint. This decorator looked something like:

{% highlight python %}
def enforce_auth(func: Callable):
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

Here extraction of the `self` argument is due to the use case of the decorator being used for instance methods. Hence, the instance is being modified after the extended functionality of the decorator is applied. Below is an example application of this decorator:

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

This ensures that the authenticate endpoint is always called before any attempt to extract the account details. I have always used decorators from third party libraries and frameworks, but it was nice to have a use case to create one myself.

## Selenium Stealth

As I mentioned earlier, I used Selenium to log in to Trading212 before extracting the login token. All of this worked properly when using Selenium in its default configuration. However, this does not provide a good user experience for a package as Selenium will try to spin up an interactive browser. So I decided to make use of Selenium's headless mode and to my dismay, I was greeted with an access denied error similar to the one in the image below:

{{image}}

I did some research about this and came across Selenium Stealth. It turns out that Selenium has some tags in headless mode that web platforms often use to detect automated client. Selenium Stealth makes it harder to detect the browser in automated mode.

It is also quite easy to use, one call wrapping Selenium's `Driver` object is all that is needed.

{% highlight python %}
stealth(driver, languages=["en-US", "en"],
        vendor="Google Inc.", platform="Win32",
        webgl_vendor="Intel Inc.", renderer="Intel Iris OpenGL Engine",
        fix_hairline=True)
{% endhighlight %}




Conclusion

Trading212 does not provide an api that enables the programmatic trading of equities, outside CFDs. Hence, I dug deep to reverse-engineer the apis and build something for [my usecase](https://haksoat.com/learning-stock-trading-python/). In this article, I wrote about how I went about building this package. I also wrote briefly about some cool things I came across along the way, such as Selenium Stealth and the use case of using ChatGPT to generate Pydantic models from JSON files.

Side note: From writing my last article on OpenBB, I got some feedback on how it is possible to purchase stocks using MQL5. However, on checking the website, I do not quite understand how to go about this. So if you read till this point and have used MQL5 to trade stocks, please help me out.