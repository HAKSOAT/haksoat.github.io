---
title:  "It’s Like The Bloomberg Terminal, But Open Source, My Experience using OpenBB"
last_modified_at: 2023-11-18T01:20:02+01:00
header:
  teaser: http://res.cloudinary.com/haks/image/upload/v1700336912/HAKSOAT_Blog/openbb-experience/openbb-asset.png
  overlay_image: http://res.cloudinary.com/haks/image/upload/v1700337803/HAKSOAT_Blog/openbb-experience/openbb-skies.webp
  caption: "Photo credit: [**DALL-E**](https://openai.com/dall-e-3)"
excerpt: "A review of OpenBB and my experience using it."
tags:
  - stock-trading
---


Hello all, this is the second article in [this series](https://haksoat.com/learning-stock-trading-python/). In this article, I will write about OpenBB and my experience using it as a data source for a trading system. I struggled to find a data source that is easy to use, but I can imagine there are tools out there that serve this purpose. If you know of or have used any, I would appreciate a mention in the comments.

I know that this article is supposed to be about OpenBB. However, permit me to divert briefly and write about the Bloomberg Terminal. The [Bloomberg Terminal](https://en.wikipedia.org/wiki/Bloomberg_Terminal) is a financial software by Bloomberg L.P. It is widely known for its large array of financial functionalities and notably provides data such as news, ticker data, financial statements, economic indicators, etc. This data richness makes it very valuable to financial analysts, investment bankers, and traders, just to mention a few. But there is a huge price to pay. It is said that [the Bloomberg Terminal costs around $24,000 per year](https://www.investopedia.com/articles/professionaleducation/11/bloomberg-terminal.asp). This price is a huge deterrent for non-professionals and trading enthusiasts. Given this context, let's see what OpenBB is about.

## What is OpenBB?

[OpenBB](https://openbb.co/) looks to provide open source, free and easy access to financial data, providing Bloomberg terminal-like features. OpenBB provides access to data such as:

- Stock prices, indicators for technical analysis
- Financial and SEC disclosure statements for fundamental analysis
- News, social media and sentiment data for behavioural analysis

[OpenBB is available on GitHub](https://github.com/OpenBB-finance/OpenBBTerminal), hence, open for contributions. As of the time of writing this article, it has three offerings: The Terminal, SDK and Bot.

[The Terminal](https://docs.openbb.co/terminal) provides access to financial data through the terminal or command prompt. It is available on Linux, macOS and Windows, through different installation methods.

[The SDK](https://docs.openbb.co/sdk) is a Python package that allows programmatic access to the features available in the terminal. While doing the research for this article, I realized some interesting functionality such as the [Forecast module](https://docs.openbb.co/sdk/reference/forecast). It has feature engineering, exploratory analysis and prediction functionality. I think this is quite cool and I should play around with those features.

[The Bot](https://docs.openbb.co/bot) is a chatbot integration currently available on Discord and Telegram. I have not made use of this integration, but I would like to imagine that they provide the same functionality as the Terminal based on existing Discord and Telegram features.

I recognize new OpenBB features from the last time I did some research on it, which is a sign of it being a fast-growing project. Some of these include: 

- a waiting list for [Terminal Pro](https://my.openbb.co/app/pro) which promises a better interface and official partnerships with data providers
- the availability of API keys, which I believe should imply improved SDK reliability
- a community to network

Given this, I believe some of the challenges I experienced will be addressed by these functionalities when they are released.

## My Experience

Overall, I think I had a good experience with OpenBB. Most of my usage was from the SDK, so there is not much to say about the other products. I did face some challenges, but I was able to use it for my experiments regardless. When I resume this project, still intend to continue using OpenBB.

### Ease of Use
I found it easy to use the SDK. The installation process was smooth. I installed it in a Google Colab notebook with a command as simple as `pip install openbb` and I was also able to set it up on [Poetry](https://python-poetry.org/). 

I liked the separation of the modules based on the kind of data as it made it easy to figure out where certain functionalities live. For example, to access stock prices all you need is `openbb.stocks.load(...)` and `openbb.stocks.news(...)` to access news data. In the case of fundamental analysis, you can access [SEC 10K filings](https://www.investopedia.com/terms/1/10-k.asp) using: `openbb.stocks.fa.analysis(...)` after which the document is parsed into groups such as Risk factors, Discussions and Analysis.

While my interests are in stocks, the SDK also provides access to data in other kinds of securities such as Crypto, Forex, Futures, etc.

### Pandas Integration
I believe one of the best decisions made by the OpenBB team was to return requested data as pandas DataFrames. This reduces the learning curve for the average Python developer who has some experience with Pandas. This decision implies that I was able to use Pandas functions such as the rolling window when processing stock prices for my algorithms.

### Challenges
While I think OpenBB is nice, I experienced some challenges while using it. These are:

- **News window limitation**: I was hoping to experiment with news data for predicting stock prices. However, I quickly realized that the API only returned very recent news data. For example, on checking $TSLA news on November 16, 2023, the oldest news was from November 2, 2023. I think the tool being free means little room to store lots of data, so I hope the Pro version tackles this.

- **Data load time**: It took a long time to load data across say 15-year timespans, and there was no caching involved. Hence, for backtesting, this process became prohibitively slow especially when running the backtests repeatedly. My solution here was to implement some caching myself, but I believe it would have been more efficient to have this implemented on their end.

- **Reliability**: I experienced the SDK breaking when I made a lot of requests for stock prices. Say I have a list of ticker symbols, I would usually loop through them individually to get the needed data. I do not believe this should be an issue as they are not being made concurrently or in parallel. However, I realized the API would break with errors relating to the ticker symbol not existing, when in fact it did exist. My bypass was to add `time.sleep` in between the requests, but the implication was that it took longer to get all the data.

## Final Thoughts
I am looking forward to the progress the team makes on the project in the coming year. I intend to continue to use the tool as infrastructure for my stock trading experiments. 

While I have written about the challenges faced using the SDK, I realize that I can very well contribute to the project and give a helping hand to the team. I hope I can do a bit of this when I have some free time. Let me take this opportunity to encourage you to contribute to [OpenBB](https://github.com/OpenBB-finance/OpenBBTerminal) if you are looking to do some open-source work.
