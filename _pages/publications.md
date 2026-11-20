---
title: "Publications"
permalink: /publications/
layout: page
toc: true
seo_title: "Publications on AI in Ecology and Marine Science | Scott Spillias"
description: "Publications by Scott Spillias on generative AI and large language models in ecology, marine ecosystem modelling, evidence synthesis and seaweed farming."
---

Also on [Google Scholar](https://scholar.google.com/citations?user=wbnHaIoAAAAJ&hl=en) and [ORCID](https://orcid.org/0000-0002-1310-5202). Code links go to the repository for each paper; see also [Software]({{ '/software/' | relative_url }}).

{% assign preprints = site.data.publications | where: "status", "preprint" %}
{% if preprints.size > 0 %}
## Preprints {#preprints}

<ul class="pub-list">
{%- for p in preprints %}{% include publication.html pub=p %}{% endfor -%}
</ul>
{% endif %}

{% assign by_year = site.data.publications | where_exp: "p", "p.status != 'preprint'" | where_exp: "p", "p.status != 'other'" | group_by: "year" | sort: "name" | reverse %}
{% for group in by_year %}
## {{ group.name }} {#y{{ group.name }}}

<ul class="pub-list">
{%- for p in group.items %}{% include publication.html pub=p %}{% endfor -%}
</ul>
{% endfor %}

{% assign other = site.data.publications | where: "status", "other" %}
{% if other.size > 0 %}
## Reports, theses and data {#other}

<ul class="pub-list">
{%- for p in other %}{% include publication.html pub=p %}{% endfor -%}
</ul>
{% endif %}
