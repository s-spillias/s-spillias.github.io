---
layout: home
title: "Scott Spillias"
permalink: /
description: "Research Scientist at CSIRO in Hobart, building and testing AI tools for marine ecosystem modelling."
hero:
  lead: "Research Scientist at CSIRO in Hobart. I build and test AI tools that help scientists assemble marine ecosystem models, and check what they produce against expert work."
  actions:
    - label: "Research"
      url: "/research/"
    - label: "Watch the MOSAIC film"
      url: "/research/#mosaic"
      icon: "fa-solid fa-play"

cards:
  - image: /assets/images/card-ai-modelling.jpg
    alt: "Kelp forest fading into circuit lines"
    title: "AI for ecosystem modelling"
    excerpt: "Methods that use large language models to find model structure, build food webs and group species, tested against expert work."
    url: "/research/#ai"
  - image: /assets/images/card-mosaic.jpg
    alt: "Still from the MOSAIC film: a fishing boat at sunset above a green sea"
    title: "MOSAIC"
    excerpt: "A desktop platform for building marine ecosystem models with an AI collaborator. Coming soon."
    url: "/research/#mosaic"
    cta: "Watch the film"
  - image: /assets/images/card-seaweed.jpg
    alt: "Kelp fronds lit from above"
    title: "Seaweed farming"
    excerpt: "My PhD work on what large-scale seaweed farming could do for food, feed and fuel, and what it would cost."
    url: "/research/#seaweed"
---

<section class="intro">
  <img class="intro__photo" src="{{ '/assets/images/profile_crop.jpeg' | relative_url }}" alt="Scott Spillias" width="132" height="132">
  <p>I'm a marine scientist at CSIRO Environment and a member of the Centre for Marine Socioecology at the University of Tasmania. Building a marine ecosystem model takes months of specialist work: choosing its structure, grouping species, assembling the food web and finding parameter values in the literature. I build tools that use large language models for these steps and measure how their output compares with expert work.</p>
</section>

## Recent {#recent}

{% include recent.html %}

<p class="more-link"><a href="{{ '/talks/' | relative_url }}">All talks and media <span aria-hidden="true">→</span></a></p>

## Research {#research}

{% include cards.html items=page.cards %}
