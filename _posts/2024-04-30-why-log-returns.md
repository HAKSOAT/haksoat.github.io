---
title:  "Why Log Returns?"
last_modified_at: 2024-04-30T00:00:00+01:00
header:
  teaser: https://res.cloudinary.com/haks/image/upload/v1714515244/HAKSOAT_Blog/why-log-returns/why-log-returns-teaser.png.png
  overlay_image: http://res.cloudinary.com/haks/image/upload/v1700337803/HAKSOAT_Blog/openbb-experience/openbb-skies.webp
  caption: "Photo credit: [**DALL-E**](https://openai.com/dall-e-3)"
excerpt: "Log returns are commonly used in investing but why? This article provides some answers."
tags:
  - stock-trading
---
I have been reading a couple of books on investments lately and I noticed the common use of log returns. 
It seems to be a standard and I did not understand why that was the case. I had this itch to know why, so I did some extra digging to find the purpose that log returns serve and I thought to write about it for the following reasons:

1. To serve as a future reference for myself, when I forget this bit of the fundamentals
2. To get myself to truly understand it and potentially apply this knowledge to novel situations
3. To attempt providing an answer to someone (maybe you), that has the burning question "Why log returns?"

Before going in to explain the various concepts, I will like to provide a trivial scenario that will serve as the basis for the breakdown to come. So if at some point, something does not make sense, you can refer to this scenario and hopefully it helps clarify things.

> A certain investor has \\$40,000 (\\$40k) and is looking to invest in two stocks, ACO and BCO.
> 
>This investor decides to put in:
>
>\\$30k ⇒ ACO
> 
>\\$10k ⇒ BCO
>
>As at the time when the purchase is made, the prices in dollars are:
>
>ACO ⇒ 20
> 
>BCO ⇒ 50
>
>Here are the prices in dollars for the stocks at the end of each month for three months:
>
>ACO: 21, 24, 22
> 
>BCO: 55, 27.5, 55
>
>Here are the values of the investments at the end of each month for three months:
>
>ACO: \\$31.5k, \\$36k, \\$33k
> 
>BCO: \\$11k, \\$5.5k, \\$11k

Given this context, I will proceed with the article. If you are looking for just information about log returns, you can just go to the [log returns section](#calculating-log-returns).

## Calculating Dollar Returns

[Dollar returns](https://learn.saylor.org/mod/book/view.php?id=53734&chapterid=37840) are very easy to calculate. You simply subtract the old value of the investment from the new value of the investment.

$$\text{return} = \text{new_value} - \text{old_value}$$

This means that the investment on:

ACO goes from \\$30k to \\$31.5k, giving a positive return of \\$1500 (profit).

BCO goes from \\$10k to \\$11k, giving a positive return of \\$1000 (profit).

The dollar return is pretty easy to calculate and intuitive. However, if one is to ask the question: "looking at the dollar returns, which is the most profitable?" Given the picture of just dollar returns alone, the answer is ACO. 
However, when you consider the amount invested, this conclusion is misleading. The reason is, the amounts put into the various investments differ. If you were to put in the same \\$30k investment into BCO, it would get to \\$33k, giving a positive return of \\$3000.

Dollar returns can tell you what the gains or losses are, but you need to know the amount of the original investment to get the full story. This shows why simply calculating the dollar returns is limited and does not provide a means to compare returns fairly across various investments, especially when the invested amount differs. This leads us into simple returns.

## Calculating Simple Returns

Simple returns can be viewed from two perspectives: percentage and ratio. Both do not require the extra context of the invested amount that dollar returns requires.

Percentage return is calculated by subtracting the old value from the new value then dividing by the old value.

$$
\text{simple_return(percentage)} = \frac{\text{new_value} - \text{old_value}}{\text{old_value}}
$$

So in the first month, ACO increases by 5%, BCO increases by 10%. With these values, you do not need to know how much was invested, to know which investment had better returns.

If one is to ask another question, "given the prices of BCO across three months, `55, 27.5, 55` after a starting price of 50 and having a simple return (percentage) of `10%, -50%, 100%`, what is the compound return after three months?".

Getting the compound return involves multiplying the simple returns, this is because the returns of month 1 influence month 2, the returns of month 1 and 2 influence month 3. If we are to calculate this using simple return (percentage), you will get misleading results.

Here are two reasons:

1. Percentages can be negative, a single negative will mean the final compound return will be a negative value even if every other return is positive. `10% * -50% * 100%` gives `-5%` . One negative should not mean that the entire return is negative.
2. Percentages are fractions and are commonly in the 0% to 100% range so they are centred around 0, this means that they give lesser values when multiplied. So in the example above, even if the values were `10% * 50% * 100%` (note that the middle figure was made positive), the value gives `5%` . The compound return should not be having a value that is way less than the individual returns.

***Enter simple return (ratio)…***

The simple return (ratio) is very similar to simple return (percentage), with a slight difference in the numerator as seen below:

$$
\text{simple_return(ratio)} = \frac{\text{new_value}}{\text{old_value}}
$$

It also has a relationship with simple return (percentage), meaning that it is possible to simply switch when necessary:

$$
\text{simple_return(percentage)} + 1 = \text{simple_return(ratio)}
$$

Given this formula above, the addition of 1 to simple return (percentage), makes all of the difference and fixes the two issues raised with percentages.

1. By converting percentage to ratio (adding 1 to the percentage), the values will always be positive. Yes, -200% is a theoretically possible value, such that you get -2+1=-1 which is a negative value, but in the domain of stocks, the worst that can happen to a stock’s value is that it drops to by 100%. But I digress, the values `10%, -50%, 100%`, become `1.1, 0.5, 2`.
2. Since the values are now centred around 1, a profit amplifies the compound return and a loss diminishes it. Going by the values `1.1, 0.5, 2`, the compound return becomes: `1.1`, converting this ratio to percentage, we get `1.1 - 1` which gives `0.1` meaning `10%.` Compare this to the calculation using percentages, where we even assumed that the 50% loss was a `50%` gain and the compound return was still `5%` , very misleading.

One more thing is that the ratio happens to be more directly interpretable than percentage, with respect to the investment amount. For example, when one says the final value of BCO is 1.1 times the initial investment, this is more intuitive than saying BCO rose by 10%.

The formula to get the final value is just as the interpretation says:

$$
\text{new_value} = \text{ratio_return} * \text{old_value}
$$

Following the format of asking questions, if one is to ask "given the BCO simple return ratios of `1.1, 0.5, 2` what is the monthly average of returns?"

In other to calculate this, you may try to use the formula for averages: $\frac{1}{N} * \sum_{i=1}^{N} x_i$.

For BCO, this means:

$$
\text{average_simple_return} = \frac{1.1 + 0.5 + 2}{3} = 1.2
$$

***But wait…*** 

Yes, we are following the formula for calculating averages, but this approach means that we are throwing the compounding effect out of the window. This should not be the case as the return for the second month is dependent on those for the first month, and those for the third month are dependent on the second and first month. 
The challenge here is that to integrate the compounding effect, we need to multiply, but the formula for averages requires summation instead. 

There is also this slight issue that one can observe with the returns from the second and third month i.e., `0.5` and `2`. This is: simple returns lack symmetry and is not very intuitive as a result. 
Where the value of `0.5` meant that the investment went from $11k to $5.5k, it can be confusing to see that it takes a simple return of `2` instead of `1.5` to get the investment back to $11k. This asymmetry is caused by the changing denominator (old_value) in the formula for simple returns.

These two issues lead us into log returns.

## Calculating Log Returns

Log returns are achieved by calculating the natural log of the simple return (ratio), yes, it’s that simple. When you have the log returns, you can go in the other direction and get the simple return (ratio) by calculating the exponent of the log return.

$$
\text{log_return} = log(\text{simple_return})
$$

$$
\text{simple_return} = exp(\text{log_return})
$$

So how do logarithms fix the issue of integrating the compounding effect into the calculation of averages? It comes down to the product rule:

$$
log_{a}(X * Y) \leftrightarrow log_{a}X + log_{a}Y
$$

This implies that we can do summation using the logarithmic values to meet the requirements of the formula for averages and also integrate the compounding effect gained from multiplication. After the calculation, we can undo the logarithmic transformation by calculating the exponent.

$$
\text{avg_simple_return} = exp(\frac{1}{N} * \sum_{i=1}^{N} log(x_i))
$$

This means:

$$
\text{avg_simple_return} = \frac{log(1.1) + log(0.5) + log(2)}{3} = exp(0.0317) = 1.0323
$$

Following the simple_return(percentage) formula from earlier, $\text{simple_return(percentage)} = \text{simple_return(ratio)} - 1$.

$$
\text{simple_return(percentage)} = 1.0323 - 1 = 0.0323 = 3.23\%
$$

Does the average of `3.23%` make sense? Yes. Considering that the second and third months were spent losing and making the money back, it is understandable that the average return is the `10%` made from the first month divided by 3. NB: [Calculations using logarithm give an approximate value of returns](https://gregorygundersen.com/blog/2022/02/06/log-returns/#approximations), which is why the return is `3.23` which is not exactly the result of dividing `10%` by 3 i.e. `3.33%` .

On the issue with symmetry, log returns do not suffer from this problem. The logarithm of `0.5` and `2` which are the simple returns for the second and third months, are `-0.6931`  and `0.6931` respectively. This clearly passes the information that the losses from the second month are recovered in the third month.

The scenarios provided so far give context about the various kinds of returns, where they fall short and how another return fills its place. But for the sake of being direct, here are more succinct reasons why log returns are quite popular:

- They support time additivity without losing the compounding effect.
- Log additions are better than multiplications as [the former avoids exponential growth or decay](https://cs.stackexchange.com/questions/77135/why-is-adding-log-probabilities-faster-than-multiplying-probabilities) that comes with the latter.
- Logarithmic transformations are used in various financial formulas and models, so log returns maintain the continuity and provide mathematical convenience.
- [Stock prices are assumed to have a log normal distribution](https://www.investopedia.com/articles/investing/102014/lognormal-and-normal-distribution.asp), so calculating their log returns helps get a normal distribution which is more suitable for different statistical models with assumptions of such a distribution. NB: The assumption of a log normal distribution for stock prices is not always true, and can be argued to not be a strong case for using log returns.

That’s the end of the article, I hope my explanation has helped provide clear answers to the question "Why log returns?". If I missed something, I would appreciate a comment to help address this. Also if you have any further questions, they are welcome.

## Further Reading

Data Preprocessing - Python for Finance Cookbook. [Amazon](https://www.amazon.co.uk/Python-Finance-Cookbook-effective-financial/dp/1803243198)

Time Stamps And Financial Modeling - Doing Data Science. [Amazon](https://www.amazon.co.uk/Doing-Data-Science-Straight-Frontline/dp/1449358659)

FRM: Why we use log returns in finance. [YouTube](https://www.youtube.com/watch?v=PtoUlt3V0CI)

Why we use Ln returns in finance. [YouTube](https://www.youtube.com/watch?v=47h5VsGahfc)

Log returns are awesome - how to apply them to trading. [Reddit](https://www.reddit.com/r/PMTraders/comments/10mdmsu/log_returns_are_awesome_how_to_apply_them_to/)

The Intuition of Log Returns - [Robot Wealth](https://robotwealth.com/the-intuition-of-log-returns/)