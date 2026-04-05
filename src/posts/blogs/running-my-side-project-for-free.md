---
title: 'Running My Side Project for Free*'
date: '2026-04-04'
category: aws
summary: 'My side project, FFAwards, runs entirely on an AWS serverless artchicture.'
draft: true
---

I am pleased to say that I did it, I actually made a side project and get a lot of people using it! Cool! Now I don't make money off it, that's fine I really don't care, but maybe I will add something but I really doubt it...look point is, I have a side project!

Problem is... it cost money to host this. Now look I went with my bread and butter here initially, node + express, react, and mysql. But when it came time to put this typical artichtuete in the cloud...well, I didn't wanna pay $30 a month! So what was the natural next move? Well HOW cheap can I make this?

At my old place of employment, we went all in with serverless, so, could I do the same? i've learned all the AWS services and knew what I needed to do...migrate everything to DynamoDB instead of MySQL.

So yeah this might follow the typical API Gateway -> Lambda -> DynamoDB flow, with S3 client hosting...but it's literally cost me $0.00, at MOSt it cost be a few cents, but that's only because I am incorrectly doing extra/bad inserts, if I fix that it will never go above a cent!

Now I know not everyones use case for a side project fits this, sure maybe you actually want to make money off of something, I get it. But for those that just want a little side project, whether it's niche or not, you can literally host this stuff for free entirely on AWS. Yes it can be intimitdating, but you will learn AWS (add that to your resume) and just set the bill alerting to $3 and you can get a text or e-mail when something goes wrong.
