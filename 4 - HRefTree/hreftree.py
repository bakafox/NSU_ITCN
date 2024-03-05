import requests
from bs4 import BeautifulSoup

import pandas as pd
import json


def format_link(link, url):
    if (not link 
        or link.startswith('#') or link.startswith('?') 
        or link.startswith('mailto:') or link.startswith('tel:')):
        return ''

    elif link.startswith('/'):
        link = url + link
    elif not '://' in link:
            link = 'https://' + link

    if link.endswith('/'):
        link = link[:-1]
    return link


def parse_links_from(url):
    if url.endswith('/'):
        url = url[:-1]

    print('Parsing links from the page...\n')

    try:
        response = requests.get(url, timeout=5)
    except requests.exceptions.Timeout:
        print("Page request timeout!\n")
        exit(1)
    if response.status_code != 200:
        print("Page request failed!\n")
        exit(1)

    bs = BeautifulSoup(response.content, 'html.parser')
    links_raw = bs.find_all('a')

    # prepare for tree formatiing
    links = []
    for a in links_raw:
        if not 'href' in a.attrs:
            continue
        link = format_link(a['href'], url)
        if link:
            links.append(link)

    return links


def format_links_as_tree(links):
    hreftree = {}
    # DOMAIN
    # |__ SUBDOMAINS
    #     |__ SUBDIRECTORIES
    #         |__ URLS

    if not links:
        print("No links found!\n")
        exit(1)
    print("Found", len(links), "links...\n")

    for link in links:
        domain = '.'.join(link.split('/')[2].split('.')[-2:])
        if not domain in hreftree:
            hreftree[domain] = {}
        
        subdomain = '.'.join(link.split('/')[2].split('.')[:-2]) + '.'
        if not subdomain in hreftree[domain]:
            hreftree[domain][subdomain] = {}

        subdirs = link.split('/')[3:]
        curr_subdir = hreftree[domain][subdomain]
        # recursively create subdirectories
        for subdir in subdirs:
            if not subdir in curr_subdir:
                curr_subdir[subdir] = {}
            curr_subdir = curr_subdir[subdir]

        if not link in curr_subdir:
            curr_subdir[link] = 1
        else:
            curr_subdir[link] += 1

    return hreftree


input = input('Enter a website to get its hreftree: ')
links = parse_links_from(format_link(input, input))
hreftree = format_links_as_tree(links)
#print(hreftree)

with open("hreftree.json", "w") as outfile: 
    json.dump(hreftree, outfile)
print("це кінець...\n")
