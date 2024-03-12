from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup

import pandas as pd

app = Flask(__name__)


def format_link(link, url_mask=''):
    if (not link 
        or link.startswith(('#', '?', 'mailto:', 'tel:', 'magnet:'))
    ):
        return None

    elif link.startswith('/'):
        link = url_mask + link
    elif not '://' in link:
        link = 'https://' + link

    if link.endswith('/'):
        link = link[:-1]
    return link


def parse_links_from_url(url):
    print(f"Parsing links from {url}...")
    response = requests.get(url, timeout=3)
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
    print('Found', len(links), 'links, formatting as hreftree...')

    for link in links:
        domain = '.'.join(link.split('/')[2].split('.')[-2:])
        if not domain in hreftree:
            hreftree[domain] = {}
        
        subdomain = '.'.join(link.split('/')[2].split('.')[:-2]) + '.'
        if not subdomain in hreftree[domain]:
            hreftree[domain][subdomain] = {}

        # recursively create subdirectories
        subdirs = link.split('/')[3:]
        curr_subdir = hreftree[domain][subdomain]
        for subdir in subdirs:
            if not subdir in curr_subdir:
                curr_subdir[subdir] = {}
            curr_subdir = curr_subdir[subdir]

        if not link in curr_subdir:
            curr_subdir[link] = 1
        else:
            curr_subdir[link] += 1

    return hreftree


@app.route('/parse')
def parse_url():
    print('Got a parse request from someone!')
    url_param = request.args.get('url')
    if not url_param:
        return jsonify({'Error': 'Missing parameter \"URL\"'}), 400

    url = format_link(url_param)
    try:
        links = parse_links_from_url(url)
        hreftree = format_links_as_tree(links)
        #print(hreftree)
        return jsonify(hreftree), 200

    except requests.exceptions.Timeout:
        return jsonify({'Error': 'Page request timeout'}), 504
    except requests.exceptions.RequestException:
        return jsonify({'Error': 'Page request failed'}), 502
    finally:
        print('The request processing finished.\n')


if __name__ == '__main__':
    # 127.0.0.1:5000/parse?url=ngs.ru
    app.run()
