---
title:  "What Goes Into Building a Trading System"
last_modified_at: 2023-11-13T01:20:02+01:00
header:
  teaser: http://res.cloudinary.com/haks/image/upload/v1699747884/HAKSOAT_Blog/building-trading-system/stock-drawdown.png
  overlay_image: http://res.cloudinary.com/haks/image/upload/v1699823654/HAKSOAT_Blog/building-trading-system/blue-sky.png
  caption: "Photo credit: [**DALL-E**](https://openai.com/dall-e-3)"
excerpt: "A look into the high-level components needed in a trading system."
tags:
  - stock-trading
---


Hello all, this is the first article in [this series](https://haksoat.com/learning-stock-trading-python/).
I will be writing about my learnings about some of the key components that go into building a trading system.
I realize that such a system is complex and there are some components involved that I may have left out;
in this case, I would appreciate briefly mentioning them in the comments.
My hope is that this article gives you an insight into the needed components
and perhaps can be beneficial to you.

These are the components I had to work with:

- Data Source: Trades are placed based on ticks or other financial data, this comes from a data provider.

- Algorithms: This determines the approach for making trades and it is often dependent on the data.

- Backtesting: This is an approach to testing how well an algorithm works; the results can influence the decision to deploy an algorithm.

- A Broker: The broker grants access to doing business in the stock market and places your trades.

- Capital & Risk Management: Your capital determines how long you can play the game, hence, it is important to stay in it as long as possible by keeping a balance between risk and potential returns.

So, the short of the story is that these components are interwoven and all need to be properly implemented to have a successful trading system. If you are still interested in learning about these components and my thoughts, you can keep reading.

## Data Source

The process of trading stocks or other investments is heavily influenced by data, all algorithms or strategies I know of depend on some history of the investment in focus. As a result, data drives the quality of investment decisions. The data needs to come from a trustworthy source, otherwise, you may end up making confident decisions on a weak foundation.

Since data influences how much money is to be made or lost, you can expect that quality data is expensive to access.
Platforms such as the [Bloomberg Terminal](https://en.wikipedia.org/wiki/Bloomberg_Terminal) and [Eikon](https://en.wikipedia.org/wiki/Eikon) charge lots of money
(in the tens of thousands) to stream their data.
There are also free and cheaper sources such as [Yahoo Finance](https://en.wikipedia.org/wiki/Yahoo!_Finance),
[OpenBB](https://github.com/OpenBB-finance/OpenBBTerminal),
[Alpha Vantage](https://www.ycombinator.com/companies/alpha-vantage),
etc. I used OpenBB in my experiments and I experienced some issues,
however, it was free and I can't complain much.

There are a couple of factors that should influence your choice to go with a data source. These are:

- **Reliability**: The data source needs to reliably provide data. Sadly, it is not a given that data sources will dependably serve requests. For different reasons, it is not uncommon for the APIs provided by cheap data sources to be broken. In an automated trading system, this can be catastrophic, especially when you have open positions.

- **Frequency**: The frequency of data from the data source determines the kind of algorithms or approaches you take. Some data sources only provide hourly or daily data. If your algorithm requires data as it comes in per minute, but your data source only provides data per hour, this won't be compatible.

- **Accuracy**: Different data sources may provide varying data prices for the same stock. There are many reasons for these deviations, some include adjusting the prices for dividends, and errors from processing numbers by the data providers. It is hard to tell if the data is accurate as this problem is only visible when a comparison is done. That said, it is important to ensure that the data obtained from your data source is accurate.

- **Promptness**: The stock market is always on the move, hence it is important for the data source to stream data as soon as it becomes available. For example, if the algorithm works on hourly data, but it takes more than an hour to gain access to the data, this information is already stale. As a result, you may be making the wrong decisions acting on such data as though it is current.

- **Market Presence**: The [NASDAQ](https://en.wikipedia.org/wiki/Nasdaq) and [NYSE](https://en.wikipedia.org/wiki/New_York_Stock_Exchange) are two of the most popular exchanges in the world and many data providers will have data for stocks listed there. However, you may be interested in trading in stocks on other exchanges such as the [London Stock Exchange](https://en.wikipedia.org/wiki/London_Stock_Exchange) and face difficulty finding data sources that cater to them. It is also possible to have cases where certain securities are not available despite the exchange being supported.

- **Variety**: When it comes to stock trading, the ticker data is the most common; such ticker data usually includes the stock price, volume, high, and low during a specific period. However, there can be other types of data such as news, social media, earnings reports, industry performance, etc. If you intend to make use of data outside stock prices in making trading decisions, it is important to have a data source for such data.

- **Delistings**: [Survivor's bias](https://www.investopedia.com/terms/s/survivorshipbias.asp) is something to be wary of when building trading systems. The absence of delisted stocks can lead to such a bias. When stocks are delisted, their data is often removed from the index by data providers. The implication of this is that you would never have an idea what patterns lead to stocks being removed from an exchange, and if it happens in the future, there will be a near-zero chance of seeing it coming.

The factors above are those I experienced while searching for data sources and when making use of [the sole data source](https://github.com/OpenBB-finance/OpenBBTerminal) in my side project. Everything relating to the data is crucial as it is the foundation upon which the other components are built. Data influences the algorithms, backtesting, capital management, risk management, and interaction with the broker.


## Algorithms

The act of trading stocks primarily involves executing a buy or sell action. You buy when you see patterns that make you believe you can sell at a higher price. A simple naive algorithm could be, buy when the price increases from the last time, and sell when the price decreases from the last time. Simply put, you can put your rules into code.

There are a lot of trading algorithms that have been made popular through academic research, trial and error outside of academia, and experience from trading the stock market manually. While there are different categories of trading algorithms, the two main I am familiar with are:

- Momentum
- Mean Reversion

### Momentum

These are algorithms that are based on trends identified in the previous prices of a stock. For example, if the price of a stock keeps rising daily for 3 days, you can probably make a guess that this momentum will carry on for 3 more days, so you can buy at the current price and sell for whatever the price is at after 3 days. [Momentum algorithms](https://www.investopedia.com/trading/introduction-to-momentum-trading/) can be way more complex than this, but the main concept is the same for all its derivatives.

### Mean Reversion
These algorithms put a huge emphasis on the mean price of a security.
The idea of [mean reversion](https://en.wikipedia.org/wiki/Mean_reversion_(finance)) is that the price of a stock can move up and down due to many unknown factors
influencing the stock market,
however, the prices will always revert to the mean at some point.
Hence, if the prices are currently lower than the mean,
you can buy the stock and sell when the prices revert to the mean.
On the other hand, you already own a stock and the prices are way above the mean,
you can sell at that price with the expectation that the prices will go down.

Mean reversion and momentum algorithms are often useful for traders who intend to short a stock. Here, shorting implies "borrowing" a stock from a broker and selling it at a price with the expectation that the prices will drop. Then you can buy back the stock when the prices have dropped, return it back to the broker and take the profit. While I do not have an interest in the concept of shorting stocks, I mention this concept here as something that is commonly combined with these algorithms.

### Machine Learning

I am not sure if I should consider machine learning to be a category of trading algorithms,
but adding it as an honourable mention.
Machine learning can be used to improve the accuracy of existing algorithms
and it can also be used to predict buy or sell decisions directly.
Since stock prices take the form of a time-series dataset,
they can serve as data for training a classification or regression algorithm.
When working on this project,
I tried using Linear Regression and XGBoost models to classify time-series inputs into buy or do-not-buy classes.
Outside numeric data, machine learning can also be applied to other kinds of data;
for example, using Natural Language Processing to find the sentiment from news and social media posts. 

Still on algorithms, I think the use of indicators can be put in the same category.
Indicators are algorithms that traders often rely on to influence their decisions.
Indicators are a tool for analysis.
There are many [commonly used indicators](https://www.ig.com/uk/trading-strategies/10-trading-indicators-every-trader-should-know-190604),
such as Moving Averages, Relative Strength Index and Bollinger Bands.
I came across [Pandas-ta](https://github.com/twopirllc/pandas-ta)
which has a list of 130+ technical indicators and integrates nicely with Pandas dataframes.
There are many other technical analysis libraries out there,
and you can explore them to find something that works for you.
It is important to know what an indicator implies and what it says about the market before acting on its values,
also one single indicator will usually not provide all information needed about the market.

## Backtesting
```
"Those who have knowledge, don't predict. Those who predict, don't have knowledge."

– Lao Tzu
```
Backtesting is the process of assessing the quality of a trading algorithm or model before pushing it into a live trading environment. When coming up with an algorithm to trade in the stock market, it is common that this involves some modelling of historical data. After coming up with a set of algorithms, it is important to do some testing before picking the suitable ones. 

One can choose to not test the algorithms and put them in the real world, trading with real money.
However, this is a naive approach as it means you will lose money and there will be no room for mistakes.
A better way to do this is
to make use of the [paper trading functionality](https://www.investopedia.com/terms/p/papertrade.asp)
if your broker supports it;
with this approach, mistakes are not costly as the money lost will not be actual funds.
While paper trading is great, its downside is that it takes time to get results from your evaluation efforts.
You may have to wait months to finally have an idea of how well the algorithm(s) performs.

The right approach to this is to take historical data and split it into three parts: train, validation and test. If you are familiar with machine learning, yes, it is [the same data-splitting concept](https://machinelearningmastery.com/train-test-split-for-evaluating-machine-learning-algorithms/). You should use the train set for study purposes and for formulating the algorithm, then the validation set for seeing how well the algorithm works. If one algorithm does not meet your expectations, you try another by studying the training set and validating again. This cycle continues till you are satisfied and choose the best algorithm from your various experiments.

After multiple cycles of experimentation, you then test your algorithm on the test dataset.
If the algorithm performs poorly,
you have saved yourself the possible heartache of seeing the algorithm fail in a live trading environment.
If it performs well, that's good news but does not still mean that things can go wrong in a live trading environment,
so it is always advisable to tread with caution.
The reason for not using the test set in the experimentation cycles is
to avoid modifying the algorithm so much that it overfits the test dataset and gives a wrong impression of its true quality.

It is also advisable to still make use of the chosen model first in a paper trading environment for extra validation. One can choose to skip this step if the situation warrants an almost immediate deployment into a live trading environment, however, you should really know what you are doing.

There are two ways to perform backtesting (do let me know if another approach exists):

- Vectorized Backtesting
- Event-driven Backtesting

### Vectorized Backtesting

This approach to backtesting involves treating the validation set as a vector, and then making predictions on that set through [vectorized operations](https://www.pythonlikeyoumeanit.com/Module3_IntroducingNumpy/VectorizedOperations.html). The implication of this is that the validation process becomes faster than it would be if you simply looped through each data point; this approach comes in handy when the validation set is large. When trying to understand how vectorized backtesting works, Python's Numpy library plays a crucial role in providing the capability for running such operations. I would like to think that this is also possible in other languages too.

If you intend to dig deeper, you can check out the chapter on "Mastering Vectorized Backtesting" from the book [Python for Algorithmic Trading](https://www.amazon.co.uk/Python-Algorithmic-Trading-Cloud-Deployment/dp/149205335X).


### Event-driven Backtesting

Unlike vectorized backtesting, this is easier to understand as it is simply the sequential approach to programming. It also involves an attempt at setting up an environment similar to what you will have when placing an order through a broker such that you can track cash and investment value. When a buy order is placed, cash is reduced and the amount goes into investment value. When a sell order is placed, cash is increased and the amount is removed from investment value. 

This approach to testing takes a longer time than vectorized backtesting. However, it has a couple of advantages. One of which is room to model a trading environment as realistically as possible. When backtesting, it is beneficial to simulate scenarios that can differ per trade, this is complex to achieve with vectorized backtesting. Some examples of such include the deduction of [trade-based commissions](https://www.investopedia.com/terms/c/commission.asp), simulation of [slippage](https://www.investopedia.com/terms/s/slippage.asp), integration of leverage into capital, etc. Another advantage of event-driven backtesting is that it does not require access to all the data at once as is the case with vectorized backtesting.

I made use of event-driven backtesting as it was easier to find errors in the algorithms. I believe this is a better approach and one should only resort to vectorized backtesting for optimization purposes. Python's [Backtrader library](https://github.com/mementum/backtrader) is a robust tool that makes event-driven backtesting a breeze.

## A Broker

A stockbroker is an entity (company or individual)
that acts as an intermediary between the trading system and the stock market.
The stockbroker places orders as needed and often charges some amount for this service.
There are a lot of platforms out there that serve this purpose such as [Interactive Brokers](https://en.wikipedia.org/wiki/Interactive_Brokers),
[Fidelity](https://en.wikipedia.org/wiki/Fidelity_Investments),
[Charles Schwab](https://en.wikipedia.org/wiki/Charles_Schwab_Corporation),
etc. The Motley Fool provides a [list of amazing trading platforms
that serve as brokers](https://www.fool.com/the-ascent/buying-stocks/).
These platforms usually have a high barrier to entry,
such as having a minimum limit to the amount deposited before making trades.

The bar set by Interactive Brokers did not put me off, as they only had a minimum requirement of about £200. However, my application was rejected. I have reasons to believe that my nationality played a role in this decision. I remember having to tick a box if I was from a small list of "special" countries (sadly, I do not have a screenshot of that page), I may be wrong though.

Like the data source, you do not have control over the broker component as it is usually an external part of the trading set-up. There are also a couple of things to watch out for in a broker:

- **Commission per trade**: You do not want to pay a lot of money per trade if your algorithm requires lots of transactions. Some brokers charge a monthly fee instead. Some brokers do not charge anything whatsoever, but you may be paying for their services somehow through marked-up security prices or slow execution speed.

- **Accuracy of data used by the broker**: If the data relied upon by the broker is erroneous, then such errors will propagate into the actual values of securities when you place an order.

- **Speed of placing trades**: If your algorithm is reliant on trades being executed in the shortest time possible, this becomes an important factor.

- **The availability of paper trading functionality**: The availability of such functionality makes it possible to test your algorithm and see how your trades may perform in a live environment. However, you are not using actual funds in a paper environment.

- **Presence or absence of leverage depending on your preference**: If you are hoping to take advantage of margin in your trading strategy, it is necessary to confirm that the broker offers such services.

- **Availability of an API**: If you intend to place trades automatically, then the broker needs to provide an API so you can place trades through code. Not all brokers have an API, so this is something to watch out for.

In my side project, I ended up making use of a free trading platform called [Trading212](https://www.trading212.com/).
This was
because I could not find a paid brokerage platform with a straightforward registration process and without massive minimum deposit requirements.
Trading212 does not have a public API,
however,
I spent some time reverse-engineering the APIs used on the web platform and built a custom library for this purpose.


## Capital & Risk Management

Capital is the lifeblood of trading securities. You are able to buy only because there is capital, after which you hope that you keep your capital and have returns when you sell. If it happens that you lose all of your capital, the game ends and you will no longer be able to trade, in more catastrophic scenarios you end up in debt. 

I did not get to do anything hands-on in relation to this component as I only had in mind to trade with negligible amounts of money, so I was fine with ending up with losses in that scenario. If you ask me, that itself is a form of capital management.

Some of the interesting concepts I came across while learning about capital management are:

- Kelly Criterion
- Leverage

### Kelly Criterion

[Kelly criterion](https://en.wikipedia.org/wiki/Kelly_criterion) is a portfolio optimization technique that aims to maximize the returns on trades while keeping risk in check. With Kelly criterion, given a number of stocks, you can decide how much to allocate to each. This concept has practical applications in gambling but turned out to be applicable when trading securities.

Here's the Kelly Criterion formula as applied to trading stocks:

$$f^* = w - \frac{1 - w}{R}$$

Where:

- $f^*$ represents the fraction of the capital to be put into a single trade of a stock.
- $w$ is the probability of making a profit or loss based on previous trades of a stock.
- $R$ is the win/loss ratio (i.e., the profit made divided by losses incurred from trading the stock across multiple trades).

Kelly criterion has various constraints which I am not covering in this article. One of them is that it tries to maximize returns a little too aggressively, which means more risk, traders with a low-risk appetite tend to make use of a fraction of Kelly criterion. For example, Half Kelly, which is investing half of what the technique proposes.

I did not make use of the Kelly criterion. However, one of the first questions I had when learning about it was: What do you do when you have not made any trades on a stock and as a result have no estimates for profit/loss probability or win/loss ratio? 

Some ideas include: 

- estimating a low-win probability and win/loss ratio
- using a fixed small amount in making the trade until there is sufficient history to rely on for placing the trades. 

### Leverage

[Leverage](https://www.ig.com/uk/risk-management/what-is-leverage) is the use of borrowed capital from a broker for trading securities. The broker usually states the terms of leverage transactions. Some of the terms will be related to when the borrowed funds are expected to be returned, the maximum or minimum to be borrowed, the interest expected when it is being returned, etc. 

Say one has a particular stock in mind but does not have enough capital to make that purchase, some brokers provide the capability to go ahead and buy. The borrowed funds will then be returned later. The trader performs this transaction with the hope that profits will be made to return the borrowed funds. However, it is also possible that such a trade can lead to losses, after which the trader still needs to pay back the borrowed amount.

The upside to leverage is that it gives a trader room to make money from nonexistent capital. In the same vane, it means the trader can possibly end up in huge losses and may be unable to pay, considering they did not even have sufficient capital in the first place. I personally have zero interest in leverage.

While capital management is focused on ensuring that you don't experience losses that wipe out your account, risk management focuses on keeping your losses smaller than your gains. The concepts are similar, but require a slight change in perspective.

Some of the interesting concepts I came across while learning about risk management are:

- Risk-free rate
- Volatility
- Drawdown Analysis

### Risk-free rate

A risk-free rate is the rate of return you get on an investment with zero risk. Investments that are often considered to have a risk-free rate include the US Treasury bill in the United States and Government bonds in the United Kingdom. It is important to state that while it is rare, [it is possible for the government to default on its debt](https://www.investopedia.com/terms/s/sovereign-default.asp).

The way I understand it though, the real value of a risk-free rate is not about the government being able to pay back with profits or not, but that the rate can be used as a benchmark for other investments. For example, if you have £50 to invest in a stock and believe you can earn about 4% in return, but the theoretical risk-free rate is 5%, then you may have to rethink if the potential return is worth the risk of investing your £50. You can instead put this money in an investment with a risk-free rate and not have to worry.

### Volatility

[Volatility](https://www.investopedia.com/terms/v/volatility.asp) is a measure of how the price of a security fluctuates. A stock that has prices with lots of huge changes is considered to be highly volatile when compared to one with fewer price movements. The implication is that a highly volatile stock can be risky as it is harder to place a bet on how the price will swing. Traders with less appetite for risk can take high volatility as a signal of an investment being unsuitable for them. 

The formula for volatility, typically represented as the standard deviation of returns, can be expressed as follows:

$$\sigma = \sqrt{\frac{1}{N-1} \sum_{i=1}^{N} (R_i - \bar{R})^2}$$

Where:

- $\sigma$ is the volatility (standard deviation).
- $N$ is the number of observations (periods).
- $R_i$ is the return in period $i$.
- $\bar{R}$ is the average return over the $N$ periods.

There are various arguments on [why volatility is not a good measure of investment risk](https://www.advisorperspectives.com/articles/2022/05/23/why-volatility-is-the-wrong-measure-of-investment-risk). One of them is that since volatility is dependent on standard deviation, it treats upwards movements the same as downward movements. Hence, a stock with lots of positive movements may have similar volatility to a stock with lots of negative movements making it hard to differentiate such nuances.

### Drawdown Analysis

The concept of drawdown introduces two other concepts: peak and trough. Peak is the highest price a security attains in a certain period. Following the peak, the lowest price experienced before the highest price is met again is the trough.

![Graph illustrating Drawdown](http://res.cloudinary.com/haks/image/upload/v1699747884/HAKSOAT_Blog/building-trading-system/stock-drawdown.png){: .align-center}

In the image above, the first peak is around £52, the trough is around £17, and the second peak is around £52.

Now that this is out of the way, drawdown is the ratio of the difference in price between the peak and the trough price to the peak price; this value is then often represented as a percentage i.e., the ratio * 100. In the example above, the drawdown is:

$$\frac{52-17}{52} * 100 = 67\%$$

A drawdown analysis is useful when combined with a backtest as it gives a good picture of the potential experience in a live trading scenario. 

Will the trader have the ability to stomach such a drawdown percentage? Can the trader endure a drawdown for such periods? How will the trader handle a situation where the stock never recovers? Is it a good idea to decide what the maximum drawdown is?

I have not applied this knowledge in my side project yet, but it is one of the most interesting concepts I learned about risk management.

## Final Points

In this article, I discussed some of the components one needs to think about when building a trading system. All of these concepts I learned through reading books and taking a course, all of which I will point out in the [further reading section](#further-reading). I also shared my experiences working with the various concepts. I intend to [write more articles about my learnings](https://haksoat.com/learning-stock-trading-python/) and they cover some of the components discussed in this article.


## Further Reading

Python for Algorithmic Trading: From Idea to Cloud Deployment, [Amazon](https://www.amazon.co.uk/Python-Algorithmic-Trading-Cloud-Deployment/dp/149205335X).

Successful Algorithmic Trading, [Goodreads](https://www.goodreads.com/en/book/show/29005500).

Machine Learning Algorithms for Trading Bootcamp, [Oreilly](https://learning.oreilly.com/live-events/machine-learning-algorithms-for-trading-bootcamp/0636920082023/0636920088138/).
