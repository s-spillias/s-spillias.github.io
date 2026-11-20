---
title: "Publications"
permalink: /publications/
layout: single
author_profile: true
toc: true
toc_sticky: true
---

Also on [Google Scholar](https://scholar.google.com/citations?user=wbnHaIoAAAAJ&hl=en) and [ORCID](https://orcid.org/0000-0002-1310-5202). Code links go to the repository for each paper; see also [Software]({{ '/software/' | relative_url }}).

{% assign preprints = site.data.publications | where: "status", "preprint" %}
{% if preprints.size > 0 %}
## Preprints {#preprints}

<ul class="pub-list">
{%- for p in preprints %}{% include publication.html pub=p %}{% endfor -%}
</ul>
{% endif %}

{% assign by_year = site.data.publications | where_exp: "p", "p.status != 'preprint'" | group_by: "year" | sort: "name" | reverse %}
{% for group in by_year %}
## {{ group.name }} {#y{{ group.name }}}

<ul class="pub-list">
{%- for p in group.items %}{% include publication.html pub=p %}{% endfor -%}
</ul>
{% endfor %}
