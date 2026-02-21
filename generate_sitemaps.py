from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Iterable
from xml.etree import ElementTree as ET


ROOT = Path(__file__).resolve().parent
BLOG_DIR = ROOT / "blog"
BASE_URL = "https://akkuelectronics.in"
TODAY = date.today().isoformat()


@dataclass
class UrlItem:
    loc: str
    lastmod: str
    changefreq: str
    priority: str


@dataclass
class NewsItem:
    loc: str
    publication_date: str
    title: str


def _read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


def _extract_title(html: str) -> str:
    og_match = re.search(r'<meta\s+property="og:title"\s+content="([^"]+)"', html, flags=re.IGNORECASE)
    if og_match:
        return og_match.group(1).strip()

    title_match = re.search(r"<title>(.*?)</title>", html, flags=re.IGNORECASE | re.DOTALL)
    if title_match:
        return re.sub(r"\s+", " ", title_match.group(1)).strip()

    return "Akku Electronics Blog Article"


def _extract_date_from_filename(filename: str) -> str | None:
    match = re.match(r"^(\d{2})(\d{2})(\d{4})", filename)
    if not match:
        return None
    day, month, year = match.groups()
    return f"{year}-{month}-{day}"


def _discover_blog_articles() -> list[NewsItem]:
    items: list[NewsItem] = []
    for html_file in BLOG_DIR.glob("*.html"):
        if html_file.name == "index.html":
            continue

        parsed_date = _extract_date_from_filename(html_file.name)
        if not parsed_date:
            continue

        html = _read_text(html_file)
        title = _extract_title(html)
        items.append(
            NewsItem(
                loc=f"{BASE_URL}/blog/{html_file.name}",
                publication_date=parsed_date,
                title=title,
            )
        )

    items.sort(key=lambda item: item.publication_date, reverse=True)
    return items


def _append_urlset_item(urlset: ET.Element, item: UrlItem) -> None:
    url = ET.SubElement(urlset, "url")
    ET.SubElement(url, "loc").text = item.loc
    ET.SubElement(url, "lastmod").text = item.lastmod
    ET.SubElement(url, "changefreq").text = item.changefreq
    ET.SubElement(url, "priority").text = item.priority


def _write_pretty_xml(path: Path, root: ET.Element) -> None:
    xml_bytes = ET.tostring(root, encoding="utf-8")
    import xml.dom.minidom as minidom

    pretty = minidom.parseString(xml_bytes).toprettyxml(indent="  ", encoding="utf-8")
    path.write_bytes(pretty)


def _core_urls() -> Iterable[UrlItem]:
    return [
        UrlItem(f"{BASE_URL}/", "2025-01-09", "weekly", "1.0"),
        UrlItem(f"{BASE_URL}/playstation.html", "2025-01-09", "weekly", "0.9"),
        UrlItem(f"{BASE_URL}/xbox.html", "2025-01-09", "weekly", "0.9"),
        UrlItem(f"{BASE_URL}/playstation-5.html", "2025-01-09", "monthly", "0.8"),
        UrlItem(f"{BASE_URL}/playstation-4.html", "2025-01-09", "monthly", "0.8"),
        UrlItem(f"{BASE_URL}/playstation-3.html", "2025-01-09", "monthly", "0.8"),
        UrlItem(f"{BASE_URL}/xbox-series.html", "2025-01-09", "monthly", "0.8"),
        UrlItem(f"{BASE_URL}/xbox-one.html", "2025-01-09", "monthly", "0.8"),
        UrlItem(f"{BASE_URL}/xbox-360.html", "2025-01-09", "monthly", "0.8"),
        UrlItem(f"{BASE_URL}/services.html", "2025-01-09", "monthly", "0.9"),
        UrlItem(f"{BASE_URL}/shop.html", "2025-01-09", "daily", "0.9"),
        UrlItem(f"{BASE_URL}/gamepad-tester.html", "2025-01-09", "monthly", "0.7"),
        UrlItem(f"{BASE_URL}/contact.html", "2025-01-09", "monthly", "0.8"),
    ]


def generate_main_sitemap(news_items: list[NewsItem]) -> None:
    urlset = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")

    for item in _core_urls():
        _append_urlset_item(urlset, item)

    blog_index_lastmod = news_items[0].publication_date if news_items else TODAY
    _append_urlset_item(
        urlset,
        UrlItem(
            loc=f"{BASE_URL}/blog/index.html",
            lastmod=blog_index_lastmod,
            changefreq="weekly",
            priority="0.8",
        ),
    )

    for article in news_items:
        _append_urlset_item(
            urlset,
            UrlItem(
                loc=article.loc,
                lastmod=article.publication_date,
                changefreq="monthly",
                priority="0.7",
            ),
        )

    _append_urlset_item(
        urlset,
        UrlItem(
            loc=f"{BASE_URL}/guides/index.html",
            lastmod=TODAY,
            changefreq="monthly",
            priority="0.8",
        ),
    )

    _write_pretty_xml(ROOT / "sitemap.xml", urlset)


def generate_news_sitemap(news_items: list[NewsItem]) -> None:
    urlset = ET.Element(
        "urlset",
        {
            "xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
            "xmlns:news": "http://www.google.com/schemas/sitemap-news/0.9",
        },
    )

    for article in news_items:
        url = ET.SubElement(urlset, "url")
        ET.SubElement(url, "loc").text = article.loc
        news = ET.SubElement(url, "news:news")
        publication = ET.SubElement(news, "news:publication")
        ET.SubElement(publication, "news:name").text = "Akku Electronics Blog"
        ET.SubElement(publication, "news:language").text = "en"
        ET.SubElement(news, "news:publication_date").text = article.publication_date
        ET.SubElement(news, "news:title").text = article.title

    _write_pretty_xml(ROOT / "sitemap-news.xml", urlset)


def main() -> None:
    news_items = _discover_blog_articles()
    generate_main_sitemap(news_items)
    generate_news_sitemap(news_items)
    print(f"Generated sitemap.xml and sitemap-news.xml with {len(news_items)} blog articles.")


if __name__ == "__main__":
    main()