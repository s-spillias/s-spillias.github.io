---
title: "Research"
permalink: /research/
layout: page
toc: true
---

I work on making marine ecosystem models faster to build and easier to check. Most of this work now uses large language models (LLMs): to draft and revise model code, to gather parameters from the literature, and to screen evidence. I test each method against expert judgement before recommending it.

## AI for marine ecosystem modelling {#ai}

Ecosystem models let fisheries and conservation managers ask "what if" questions, but building one can take months of specialist work. With colleagues at CSIRO I reviewed where AI can help across the modelling cycle in [*BioScience*](https://doi.org/10.1093/biosci/biaf169), and I set out a research agenda for generative AI in marine ecosystem modelling in [*Fish and Fisheries*](https://doi.org/10.1111/faf.70037). Beth Fulton and I talked about the review on the [BioScience Talks podcast](https://bioscience-talks.aibs.org/episodes/ai-and-ecosystem-modeling-with-scott-spillias-and-beth-fulton).

### MOSAIC {#mosaic}

<figure class="video-figure">
  <video controls preload="metadata" playsinline poster="{{ '/assets/images/mosaic-poster.jpg' | relative_url }}">
    <source src="{{ '/assets/video/mosaic.mp4' | relative_url }}" type="video/mp4">
    Your browser can't play this video. <a href="{{ '/assets/video/mosaic.mp4' | relative_url }}">Download it (MP4, 11 MB)</a>.
  </video>
  <figcaption>MOSAIC in one minute (turn the sound on). The narration voice and music were generated with AI. I wrote about making the film on <a href="https://vitaexmachina.substack.com/p/were-making-explainer-videos-with">Vita ex machina</a>.</figcaption>
</figure>

MOSAIC (Modular Ocean Simulator with Artificial Intelligence Collaboration) is a desktop application for building marine ecosystem models. You assemble a model from species, food webs, habitat maps and pressures such as fishing and warming, and can run the same ecosystem in four frameworks: CORSA for space and habitat, Ecopath with Ecosim for trophic interactions, mizer for body size, and Atlantis for the whole system. An AI collaborator suggests parameter values from the literature and shows the evidence for each one. The modeller accepts or rejects every suggestion, and each change is logged. I presented it at [AMSA 2026](https://amsa-2026.p.asnevents.com.au/days/2026-09-01/abstract/140220) using CORSA models of Australian shelf ecosystems.

**Coming soon.** MOSAIC is still in development and will be released as open-source software under the MIT licence. If you'd like to try it on your own system, add a modelling framework, or collaborate on it, [email me](mailto:{{ site.author.email }}?subject=MOSAIC).
{: .callout}

### Finding model structure from data {#lemma}

LEMMA (LLM-Enabled Mechanistic Modelling for ecosystem Assessment) puts an LLM inside an evolutionary algorithm. The LLM writes, tests and revises mechanistic models that explain time-series data, and Template Model Builder (TMB) estimates their parameters. In a nutrient–phytoplankton–zooplankton test it recovered the known dynamics, and for crown-of-thorns starfish outbreaks on the Great Barrier Reef its models came close to those built by experts.

[Paper (*Methods in Ecology and Evolution*, 2026)](https://doi.org/10.1111/2041-210x.70244) · [Code](https://github.com/s-spillias/EMs-with-LLMs)

### Building food webs from the literature {#spell}

SPELL (Synthesising Parameters for Ecosystem modelling with LLMs) groups species and builds diet matrices for Ecopath with Ecosim and Atlantis from public data and the literature. Across four Australian regions its species groupings were more than 99.7% consistent between runs. Compared with the expert food web for the Great Australian Bight, 92.6% of its group assignments were at least partly correct and it identified 82% of trophic links.

[Paper (*Environmental Modelling & Software*, 2026)](https://doi.org/10.1016/j.envsoft.2026.106865) · [Code](https://github.com/s-spillias/AI-EwE-Diets)

### Classifying species into functional groups {#grouping}

I benchmarked open and closed LLMs on sorting marine taxa into functional groups, both from scratch and into predefined schemes, and compared the results with expert groupings.

[Paper (*Ecological Informatics*, 2026)](https://doi.org/10.1016/j.ecoinf.2026.103984) · [Code](https://github.com/s-spillias/EcoGrouping)

## AI for evidence synthesis {#evidence}

Systematic reviews in ecology and environmental management can involve screening tens of thousands of abstracts. With colleagues at CSIRO and elsewhere I have tested how LLMs can share that work with human reviewers.

- **Screening at scale.** An ensemble of five open-source LLMs, run locally, across ten systematic reviews (19,155 records). With a stopping rule, reviewers reached at least 95% recall after screening about 56% of records on average. The method is available as the R package [screenllm](https://cran.r-project.org/package=screenllm). [Preprint (2026)](https://doi.org/10.64898/2026.07.29.741127)
- **Human–AI screening.** An early test of LLMs working with people to find literature for an evidence synthesis. [*Cell Reports Sustainability* (2024)](https://doi.org/10.1016/j.crsus.2024.100132)
- **Extracting qualitative data.** How well generative AI extracts qualitative information from papers on community-based fisheries management. [*Environmental Evidence* (2025)](https://doi.org/10.1186/s13750-025-00362-9)
- **Statistics.** With Chris Brown, how to prompt LLMs for sound ecological statistics. [*Methods in Ecology and Evolution* (2026)](https://doi.org/10.1111/2041-210x.70267)

## Seaweed farming and ocean food systems {#seaweed}

My PhD at the University of Queensland asked whether farming seaweed could reduce pressure on land, and what it would cost elsewhere.

- Using the GLOBIOM land-use model, we estimated how much global land-use pressure could fall if seaweed products replaced some food, feed and fuel. If seaweed made up 10% of global diets, about 110 million hectares of land would not need to be converted to farmland. [*Nature Sustainability* (2023)](https://doi.org/10.1038/s41893-022-01043-y), covered by *The Guardian*, ABC News, ABC Radio's *AM*, *Popular Science* and others ([media coverage]({{ '/talks/#media' | relative_url }})).
- A review of the empirical evidence for the social and ecological impacts of seaweed farming. [*PLOS Sustainability and Transformation* (2023)](https://doi.org/10.1371/journal.pstr.0000042)
- Workshops with Australian experts on how seaweed farming could affect the Sustainable Development Goals. [*Journal of Cleaner Production* (2022)](https://doi.org/10.1016/j.jclepro.2022.133052)
- Reducing the trade-offs of seaweed farming. [*Journal of Cleaner Production* (2024)](https://doi.org/10.1016/j.jclepro.2024.141150)
- Design principles for marine permaculture. [*One Earth* (2024)](https://doi.org/10.1016/j.oneear.2024.01.012)

As a postdoc at IIASA I added fisheries and aquaculture to GLOBIOM to assess blue growth scenarios ([code](https://github.com/s-spillias/globiom-fish)).
