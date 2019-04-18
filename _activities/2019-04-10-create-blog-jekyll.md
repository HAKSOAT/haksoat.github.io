---
title:  "Creating a Blog With Jekyll"
classes: wide
header:
  teaser: https://cdn-images-1.medium.com/max/1200/0*N8RG95bKJnnF-wpL.png
  overlay_image: https://res.cloudinary.com/haks/image/upload/v1554991771/Webp.net-compress-image.jpg
  caption: "Photo credit: [**MythsAndMountains**](https://mythsandmountains.com)"
excerpt: "Personal experience on creating a blog using Jekyll and the Minimal Mistakes theme."
---

Hello guys!

For a couple of months now, I’ve been considering building a personal blog and portfolio site.

However, I’ve stalled on it for a couple of reasons.

- I wanted to build the blog myself
- I couldn’t decide between it being a blog or a portfolio
- I couldn’t put in the time

Going by this, you’ll realize that I probably wanted to build a blog but didn’t want to put in the time. One option that comes to mind is WordPress.
However, since I do not have strong PHP and JavaScript knowledge, I’ll struggle at giving the site a look I love without having to learn a lot.

Fast forward to April; I got a job to write an article on Static Site Generators. Before this time, I’ve heard about Static Site Generators, but I’ve never taken the time to check them out. Of all the SSGs out there, I heard of Gatsby more often than others.
Writing this article caused me to research why Static Site Generators were the new cool.

At this point, I was no longer thinking of building my site in Flask or Django. The battle was choosing between a Content Management System (CMS) like WordPress or using a Static Site Generator.

Some of the points that won me over when you get to look at the advantages of Static Site Generators is that:
- It arguably has a better performance
- It works amazingly well with version control
- It didn’t require me to touch server-side code
- I didn’t have to bother about being hacked

Static Site Generators looked promising, and the thoughts of running a blog and portfolio without having to worry about so many things were enticing.

If I had chosen WordPress though, I would have gotten the site up in quicker time than I did, and may not be having to face some of the issues I’m currently facing running a website powered by a Static Site Generator.

## Why Jekyll?

While doing my research for the article, I learned about three main Static Site Generators. They are:
- Gatsby
- Hugo
- Jekyll

They all have significant advantages and as expected certain disadvantages. For me, one of the obstacles that put me off from using Gatsby is that it required me to have some knowledge of React to make changes to themes or build an interface I loved.
But I never checked out Hugo despite its speed and powerful features. 
I ended up choosing Jekyll.

## Getting Started with Jekyll
Jekyll is straightforward to use, and now that I look at it, Hugo and Gatsby may not have been as challenging to use as I thought they’d have been.
I can quickly generate the default Jekyll site with the command:

`jekyll new .`

Running the command above generated default pages such as the 404, about, index pages.
However, it only comes with the standard theme called minima. It looked quite dull to me, and since I’m new to Jekyll, I didn’t want to go into playing around with files.

Luckily for me, I came across the [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/) theme.

Since I'm a nomad in the land of Jekyll, looking for the best alternatives for themes, and decided to check out its configuration page. I saw the powerful configurations that were available, and was impressed.

It has different themes such as light, dark, dirt, neon, contrast and the full range of options are impressive.
I also liked from the demo, the fact that I could make my info show on the left side of the page—for desktop users. It was just about the perfect option for me.

I also realized early on that I could create different aspects of the site. Remember me talking about being between building a portfolio or a blog? So, I decided to stick to Minimal Mistakes. 

It was difficult finding my way around, but I’ve learned to be very patient and pay attention to the tiniest details as a developer. I was able to go through the code and figure out the parts of the entire setup that influenced the theme and the site in general.

## Tips
In this section, I’ll talk about some tips you may find useful if you decide to go this same route and create your site using Jekyll.
I’ll talk about the following:
- Ruby Gemfile
- The _config.yml
- The _layouts directory
- The _pages directory
- The _includes directory

**Ruby Gemfile**

As someone coming from a Python and Linux background, I am accustomed to installing Python packages using the sudo command. Sadly, taking this experience into Ruby burnt me.

Whenever you are running any Ruby command such as installing Gems, stay away from using the sudo command, else you can’t do anything else with that package without using sudo.
For example, I installed Jekyll using sudo at some point, and I couldn’t use it without needing root access.

**The _config.yml**

This is the brain of the static site. A lot of changes you’ll be making on the site will be dependent on the settings you have in this configuration file. So, you need to be ready to fiddle with the contents of that file.

It is was in the file that I had to set the site title and description, author description, enable plugins and so much more. I’d advise that you check the contents of the _config.yml of the theme you are working with, as this will help you understand how the contents of the file affect the whole site.

**The _layouts directory**

If you’d be working with Markdown for other parts of the site, you need to be ready to work with HTML here. It is in this directory that the different layouts or outlook of different parts of the site are defined.

For example, you can decide to have a different layout for single pages, archives, posts, portfolios, etc.

What I did was to copy the contents of all the layout files from the Minimal Mistakes GitHub, then I edited some layout files to match what I wanted.

**The _pages directory**

In this directory, you’ll have the files that make up your pages. Here, you'll find standard pages such as the 404, about, contact pages. It is also fine to create post and portfolio pages here.

By post and portfolio pages, I meant pages that will display your blog posts or the projects present in your portfolio.

**The _includes directory**

The files in the _includes directory make up the entire layout of the site, and it's typical to find the header, footer, sidebar files here. When working on your local machine, Jekyll may run fine without you needing the _includes directory.
But as I learned the hard way, when you deploy to GitHub pages, the site will not build successfully. Every file that was referenced by include in the layout directory needs to be present in the _includes directory.

## GitHub Pages
Being able to have total control over my site and also deploy to a free platform is one reason why I chose a static site generator. I found it easy to make use of GitHub pages.

From the tutorials read, the repository name has to be made up of the GitHub username and the github.io domain. In my case, the repository name was haksoat.github.io; I made it private by the way :-P so you can’t see it.

You can use this to push your Jekyll powered site from your local machine to GitHub.
After pushing, I checked the settings part of the repository I pushed to, to confirm if everything went on well.

## Conclusion
That’s all, for now, friends, it feels excellent writing my first post on this platform, and I hope it either helps someone having issues understanding Jekyll or inspires someone to try out Static Site Generators.

Till next time guys, stay ambitious.
