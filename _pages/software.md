---
title: "Software"
permalink: /software/
layout: page
toc: true
seo_title: "Software: AI Tools for Ecology and Systematic Reviews | Scott Spillias"
description: "Open-source AI tools for ecology: LLM-assisted literature screening (screenllm), ecosystem model discovery (LEMMA), food web building (SPELL) and MOSAIC."
---

Code for most of my papers is on [GitHub](https://github.com/s-spillias). These are the tools most likely to be useful to others.

## Ecosystem modelling {#modelling}

### MOSAIC (in development) {#mosaic}

Software for building, running and comparing marine ecosystem models in CORSA, Ecopath with Ecosim (through Rpath) and mizer, with experimental support for Atlantis. It includes LLM agents that draft model structure and parameters, search the literature for parameter values and check models for consistency. It is not yet publicly available; if you would like to try it or contribute, [email me](mailto:{{ site.author.email }}?subject=MOSAIC).

[Description and one-minute film]({{ '/research/#mosaic' | relative_url }})

### LEMMA {#lemma}

An evolutionary framework in which LLMs write, test and revise mechanistic ecosystem models from time-series data, with parameters estimated in Template Model Builder (TMB). The repository includes the nutrient–phytoplankton–zooplankton and crown-of-thorns starfish case studies.

[GitHub](https://github.com/s-spillias/EMs-with-LLMs) · [Paper](https://doi.org/10.1111/2041-210x.70244)

### SPELL {#spell}

Builds species groupings and diet matrices for Ecopath with Ecosim and Atlantis from public data repositories and the literature.

[GitHub](https://github.com/s-spillias/AI-EwE-Diets) · [Paper](https://doi.org/10.1016/j.envsoft.2026.106865)

### EcoGrouping {#ecogrouping}

A benchmark of LLMs classifying marine taxa into functional groups, both from scratch and into predefined schemes.

[GitHub](https://github.com/s-spillias/EcoGrouping) · [Zenodo archive](https://doi.org/10.5281/zenodo.22091807) · [Paper](https://doi.org/10.1016/j.ecoinf.2026.103984)

### TranslatingMEMs {#translating}

The protocol for a study testing whether AI tools help modellers translate an existing ecosystem model into another framework, for example from Ecopath with Ecosim to mizer.

[GitHub](https://github.com/s-spillias/TranslatingMEMs)

## Evidence synthesis {#evidence}

### screenllm {#screenllm}

An R package for LLM-assisted title and abstract screening in systematic reviews. It ranks records with an ensemble of open-source LLMs served locally through Ollama, so nothing leaves your machine, then applies the SAFE stopping rule to show which records a person still needs to screen. It includes a Shiny app and a getting-started guide for people new to R.

```r
install.packages("screenllm")
```

[CRAN](https://cran.r-project.org/package=screenllm) · [GitHub](https://github.com/s-spillias/screenllm) · [Preprint](https://doi.org/10.64898/2026.07.29.741127)

### AI_Extraction {#extraction}

Python scripts that use LLMs to answer set questions about each paper in a corpus and check the answers. Written for the *Environmental Evidence* (2025) study of community-based fisheries management literature.

[GitHub](https://github.com/s-spillias/AI_Extraction) · [Paper](https://doi.org/10.1186/s13750-025-00362-9)

### GPT-Screening {#gpt-screening}

LLM screening and data extraction for systematic reviews, from the *Cell Reports Sustainability* (2024) study. GPT-Screening-Update adds a web interface for uploading papers and setting screening criteria.

[GitHub](https://github.com/s-spillias/GPT-Screening) · [Web version](https://github.com/s-spillias/GPT-Screening-Update) · [Paper](https://doi.org/10.1016/j.crsus.2024.100132)

## Seaweed and land use {#seaweed}

- [Global-Seaweed](https://github.com/s-spillias/Global-Seaweed) and [HolisticKelpFarming](https://github.com/s-spillias/HolisticKelpFarming): analysis code from my PhD work on seaweed farming.
- [globiom-fish](https://github.com/s-spillias/globiom-fish): analysis and figures for fisheries and aquaculture in the GLOBIOM land-use model under blue growth scenarios.
