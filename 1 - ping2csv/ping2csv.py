import requests

import pandas as pd


def get_reason(status_code):
    codeFirstDigit = status_code // 100
    if (codeFirstDigit == 1):
        return 'ℹ️ Information'
    elif (codeFirstDigit == 2):
        return '👌 OK!'
    elif (codeFirstDigit == 3):
        return '↗️ Non-resolvable Redirect' # "requests" resolves regular redirects automatically, thus the clarification
    elif (codeFirstDigit == 4):
        return '💻 Client Error'
    elif (codeFirstDigit == 5):
        return '🗄️ Server Error'
    else:
        return '❓ (unknown)'


domainList = []

while (True):
    currDomain = input('Enter a domain to add to ping list, or leave empty to start: ')
    if not currDomain:
        break
    domainList.append(currDomain)


resultsDF = pd.DataFrame(columns=['Domain', 'Connected?', 'Response (ms)', 'HTTP Code', 'Descrption'])

for i in range(len(domainList)):
    try:
        r = requests.get(domainList[i], timeout=3) # connection ok
        resultsDF.loc[i] = (domainList[i], '✔️ Yes', (r.elapsed.microseconds / 1000), str(r.status_code), get_reason(r.status_code))
    except: # try with http://, just for sure
        try:
            r = requests.get('http://' + domainList[i], timeout=3)
            resultsDF.loc[i] = ('http://' + domainList[i], '✔️ Yes', (r.elapsed.microseconds / 1000), str(r.status_code), get_reason(r.status_code))
        except requests.exceptions.Timeout: # timed out
            resultsDF.loc[i] = (domainList[i], '⌛ Timed out', '—', '—', '—')
        except: # connection failed for another reasons
            resultsDF.loc[i] = (domainList[i], '❌ Failed', '—', '—', '—')


output = open('ping2csv.csv', 'w')
resultsDF.to_csv(output, encoding='utf-8')
print('\nResults saved to "ping2csv.csv".')