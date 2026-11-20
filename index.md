---
layout: splash
title: "Scott Spillias"
permalink: /
excerpt: "Research Scientist at CSIRO in Hobart, building and testing AI tools for marine ecosystem modelling."
header:
  overlay_color: "#000"
  overlay_filter: "0.35"
  overlay_image: "/assets/images/banner.jpeg"
  actions:
    - label: "Research"
      url: "/research/"
    - label: "Publications"
      url: "/publications/"

feature_row:
  - image_path: /assets/images/card-ai-modelling.jpg
    alt: "Kelp forest fading into circuit lines"
    title: "AI for ecosystem modelling"
    excerpt: "Methods that use large language models to find model structure, build food webs and group species, tested against expert work."
    url: "/research/#ai"
    btn_label: "Read more"
    btn_class: "btn--primary"
  - image_path: /assets/images/card-mosaic.jpg
    alt: "Still from the MOSAIC film: a fishing boat at sunset above a green sea"
    title: "MOSAIC"
    excerpt: "A desktop platform for building marine ecosystem models with an AI collaborator. Coming soon; watch the one-minute film."
    url: "/research/#mosaic"
    btn_label: "Watch the film"
    btn_class: "btn--primary"
  - image_path: /assets/images/card-seaweed.jpg
    alt: "Kelp fronds lit from above"
    title: "Seaweed farming"
    excerpt: "My PhD work on what large-scale seaweed farming could do for food, feed and fuel, and what it would cost."
    url: "/research/#seaweed"
    btn_label: "Read more"
    btn_class: "btn--primary"
---

I'm a marine scientist at CSIRO Environment and a member of the Centre for Marine Socioecology at the University of Tasmania. Building a marine ecosystem model takes months of specialist work: choosing its structure, grouping species, assembling the food web and finding parameter values in the literature. I build tools that use large language models for these steps and measure how their output compares with expert work.

## Recent

- **Nov 2026:** Seminar at the University of Rhode Island Graduate School of Oceanography (Bio at Noon), "Ecosystem Modelling with Agentic AI".
- **Oct 2026:** Keynote for Workshop 1 at the [PICES-2026 Annual Meeting](https://meetings.pices.int/meetings/annual/2026/PICES/Program) in Nanaimo, Canada, on connecting the Fish-MIP and PICES ecosystem modelling communities.
- **Oct 2026:** [A one-minute film about MOSAIC]({{ '/research/#mosaic' | relative_url }}), the modelling platform I'm building. I wrote about how it was made on [Vita ex machina](https://vitaexmachina.substack.com/p/were-making-explainer-videos-with).
- **Sep 2026:** [screenllm](https://cran.r-project.org/package=screenllm) is on CRAN. It's an R package for LLM-assisted title and abstract screening that runs on a laptop.
- **Sep 2026:** Talk at AMSA 2026, ["An AI-Supported Platform for Marine Ecosystem Modelling"](https://amsa-2026.p.asnevents.com.au/days/2026-09-01/abstract/140220).
- **2026:** Papers in *Methods in Ecology and Evolution* (two), *Environmental Modelling & Software*, *Ecological Informatics*, *Fish and Fisheries* and *BioScience*. See [Publications]({{ '/publications/' | relative_url }}).

More in [Talks & Media]({{ '/talks/' | relative_url }}).

## Research

{% include feature_row %}
