import requests
from bs4 import BeautifulSoup

import pandas as pd


# get title page
print('Parsing news links from title page...\n')
try:
    response = requests.get('https://ngs.ru/', timeout=3)
except requests.exceptions.Timeout:
    print("Page request timeout!\n")
    exit(1)
if response.status_code != 200:
    print("Title page request failed!\n")
    exit(1)

# scrape all news links
bs = BeautifulSoup(response.content, 'html.parser')
links_raw = bs.find('div', class_='cXfCE'
    ).find_all('a', class_=[
        'xjYJp', # headline cards
        'Jstj9', # news of the day
        'T3fnP', # 2-row horizontal cards
        'FYpgD', # 3-row horizontal cards
        '-wwmz', # vertical cards
        'zfPmB', # colored cards
        'klbbN', # entertainment news
        'QOMxJ'  # sidebar headings
    ])

# format as set ready to be traversed
links = set()

for a in links_raw:
    link = a['href']

    # remove advertisement news
    if '?erid=' in link:
        continue

    # append website if needed
    if not link.startswith('https://ngs.ru'):
        link = 'https://ngs.ru' + link
    links.add(link)


# traverse to every found link and scrape data
resultsDF = pd.DataFrame(columns=[
    'CATEGORY',
    'Title',
    'Date',
    'Views',
    'Introduction',
    'Text (1st paragraph)'
])

for link in links:
    print("Now parsing:", link)
    try:
        response = requests.get(link, timeout=1)
    except requests.exceptions.Timeout:
        print("Page request timeout, skipping.\n")
        continue
    if response.status_code != 200:
        print("Page request failed, skipping.\n")
        continue

    # scrape needed info and write to dataframe
    bs = BeautifulSoup(response.content, 'html.parser')

    category = bs.find('a', class_='M5IeQ')
    if not category:
        category = '—'
    else:
        category = category.text

    title = bs.find('h1', class_='dC3nv')
    if not title:
        title = '—'
    else:
        title = title.text

    date = bs.find('time', class_='_2DfZq')
    if not date:
        date = '—'
    else:
        #date = date.attrs['datetime']
        date = date.text

    views = bs.find('span', class_='_7TAx-')
    if not views:
        views = '—'
    else:
        views = views.find('span').text.replace(' ', '')
    
    intro = bs.find('p', class_='MESUc')
    if not intro:
        intro = '—'
    else:
        intro = intro.text

    text = bs.findAll('div', class_='qQq9J')
    if not text:
        text = '—'
    else:
        text = text[0].find('p').text

    resultsDF.loc[len(resultsDF.index)] = [category, title, date, views, intro, text]


print('\nParsing finished successfully!')
output = open('ngs_parser.csv', 'w')
resultsDF.to_csv(output, encoding='utf-8')
print('Results saved to "ngs_parser.csv".')
