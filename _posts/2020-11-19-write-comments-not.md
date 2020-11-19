---
title:  "To Write Comments or Not: Part One"
last_modified_at: 2020-11-19T20:09:02+01:00
header:
  overlay_image: https://sm.mashable.com/t/mashable_in/photo/default/nasa-galaxy_9pu4.1920.jpg
  caption: "Photo credit: [**Mashable**](https://in.mashable.com/science/3303/nasa-shares-the-most-detailed-image-of-outer-space-ever-and-were-awestruck)"
excerpt: "In this article, I talk about reasons why I used to avoid writing comments in code."
tags:
  - coding
---


Writing comments for me, happens to be an art, something I consciously try to get better at; but this wasn't always the case. Just about 18 months ago, I was of the school of thought that comments were an indication of poorly written code. As they say, change is the only constant thing, and I have a different perspective now.

In this article, I am going to write about the reasons why I felt comments were a red flag.

Before I proceed, I hope you are able to benefit from this write-up even if you'd think this perspective is very much valid or flawed. Perhaps it will help shape how you think about writing comments regardless of your current skill level.

So, jumping right in...

## Why I Felt Comments Were a Red Flag

I enjoy watching talks from a particular experienced software engineer in the community. He always has a lot of insightful tips and stories and there are many things to gain from him sharing experiences and opinions.

Sure, he doesn't shy away from talking about comments, so it's not hard to see where I got my opinions on writing comments from. His points did make sense to me, and they were and are still very valuable.

Here were some of my reasons for avoiding comments. It:
 1. Promotes Poor Variable Names
 2. Breeds Code Smell
 3. Hard to Maintain

### Promotes Poor Variable Names
This is a fairly common scenario. Thinking up quality variable names can be very hard, and with many things, you can only get better by consciously working towards it.

For example, you may find a code snippet like:

{% highlight javascript %}
// The product name
let h1 = document.querySelector('h1#product-name');
{% endhighlight %}

The use of the variable name `h1` in this context can be considered to be poor naming, and this is being covered up by the use of the comment.

Say in its place, you have:

{% highlight javascript %}
let productName = document.querySelector('h1#product-name');
{% endhighlight %}


Using a variable name like the one above makes the comment redundant. Hence, when a proper variable name is used, this often does a good job of explaining the contents of the variable.

While the example used in this section is made up, the message remains: using the right variable name often reduces the need for a comment.

### Breeds Code Smell

According to Wikipedia: 
> A code smell is a surface indication that usually corresponds to a deeper problem in the system.

One very good trait of a comment is; it shouldn't contain information that can very easily be picked up from reading the actual code.

Providing another example, this time slightly modified from an actual repository on Github:

{% highlight javascript %}
...
...
...
// let playerB play after 50 new coordinate of ball movement
count += 1
if (count == 49){
   count = 0;
   nextplayer = 'B';
} 
else 
{
   nextplayer = 'A';
};
...
...
...
{% endhighlight %}

In this situation, the comment isn't adding any value to the code base. The information in that comment can easily be gotten from the actual code. If a comment like this becomes absolutely necessary, it could be a sign of an issue in the preceding parts of the code base.

A more concrete example; imagine an extremely long function 😫 that has different sections to it. 

Using pseudocode:

```
function StoreUser(stream){
  // Getting input from the user
  RECEIVE INPUT FROM USER
  // Cleaning the input
  CLEAN INPUT
  // Adding the input to a database
  ADD TO DATABASE
};
```
From the above example, the ALL CAPS indicates actual code. Let's say the actual code spans across 50 lines—note that the number of lines is not a metric for complexity—making the `StoreUser` function a 150+ line function.

While the comments above each section provide some value by helping the reader understand what the code below it does, they hide a code smell. 

The code smell can probably be fixed by extracting the large chunks of code into functions of their own. Such that it now looks like:

```
function StoreUser(stream){
  let input = getInput(stream);
  input = cleanInput(input);
  addToDB(input);
};
```

Now those comments are no longer needed, the names given to the functions already do the job of describing what's going on. This example is not exhaustive of the various situations where commenting may breed code smell. 

As you may have realized already, many things in software engineering are very dependent on your use case, and comments are no different.

### Hard to Maintain
You will often hear of this reason, as a valid one for not writing code. There's no doubt, comments can be hard to maintain, especially in a rapidly changing code base.

Take for example you have a code snippet like:

{% highlight javascript %}
//Calculates the Euclidean distance
let xdiff = x1-x2;
let ydiff = y1-y2;
let distance = Math.sqrt(xdiff ** 2 + ydiff ** 2);
{% endhighlight %}

Then for some business reason, the Euclidean distance is not what is needed anymore but the Manhattan distance—you don't have to be concerned what Manhattan or Euclidean distance means. All that matters is that the code needs to change.


{% highlight javascript %}
//Calculates the Manhattan distance
let xdiff = x1-x2;
let ydiff = y1-y2;
let distance = xdiff + ydiff;
{% endhighlight %}

You notice how the comment also had to be modified? Yes. That's the argument. It is quite tasking to modify code and the accompanying comments. A lot of brain work often goes into writing good comments, so it can be discouraging to write them if they'll end up being discarded.

When code and comment changes get to happen very often, things can become messy. Considering human nature, the chances of writing poor comments or even forgetting to modify them increases.

Imagine that I forgot to modify that comment and the code says:

{% highlight javascript %}
//Calculates the Euclidean distance
let xdiff = x1-x2;
let ydiff = y1-y2;
let distance = xdiff + ydiff;
{% endhighlight %}

Someone new to the code base will be left confused as to which is the desired operation; Euclidean or Manhattan.

## Wrapping Up
In this article, I have discussed my reasons for avoiding comments which are that it promotes the use of poor variable names, breeds code smell and makes code harder to maintain.

Now you may have different opinion, I expect that you may agree or disagree with some or even all of my points. So, I will like you to share your thoughts.

There's going to be a second part to this article, there I will talk about what caused a change of perspective and my current approach to writing comments. But before then, what has your experience writing comments and working with comments written by others been like?
