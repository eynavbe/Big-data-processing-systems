import requests
import matplotlib.pyplot as plt
import pandas as pd
import sys

def neo_data_last_month():
    today = pd.Timestamp.now().date()
    before = (today - pd.DateOffset(months=1)).date()
    url = 'https://ssd-api.jpl.nasa.gov/cad.api'
    params = {
        'date-min': str(before),
        'date-max': str(today),
        'sort': 'dist'
    }
    response = requests.get(url, params=params)
    data = response.json()['data']

    sizes = []
    for entry in data:
        sizes.append((entry[3]))
    return sizes


def neo_data_next_24_hours():
    today = pd.Timestamp.now().date()
    tomorrow = today + pd.Timedelta(days=1)
    url = 'https://ssd-api.jpl.nasa.gov/cad.api'
    params = {
        'date-min': str(today),
        'date-max': str(tomorrow),
        'sort': 'dist'
    }
    response = requests.get(url, params=params)
    if 'data' in response.json():
        data = response.json()['data']
        table_data = []
        for entry in data:
            name = entry[0]
            orbit_id = entry[1]
            dist = float(entry[4])
            dist_min = float(entry[5])
            dist_max = float(entry[6])
            v_rel = float(entry[7])
            v_inf = float(entry[8])
            t_sigma_f = entry[9]
            h = float(entry[10])
            table_data.append([name, orbit_id, dist, dist_min, dist_max, v_rel, v_inf, t_sigma_f, h])

        print('NEOs passing near KA in the next 24 hours:')
        print('{:<10} {:<8} {:<20} {:<20} {:<20} {:<15} {:<15} {:<10} {:<8}'.format('Name', 'Orbit ID', 'Distance', 'Min Distance', 'Max Distance', 'Relative Velocity', 'Infinity Velocity', 'T-Sigma-F', 'H'))
        for entry in table_data:
            print('{:<10} {:<8} {:<20} {:<20} {:<20} {:<15} {:<15} {:<10} {:<8}'.format(*entry))



def main():
    if(len(sys.argv) > 1):
        func_choose = sys.argv[1]
        if func_choose == 'neo_data_next_24_hours':
            neo_data_next_24_hours()        
        if func_choose == 'neo_data_last_month':
            sizes = neo_data_last_month() 
            print(str(sizes))


if __name__ == '__main__':
    main()


# print(sizes)
# print(len(sizes))
# Plot the graph of asteroid distribution
# plt.hist(sizes, bins=20)
# plt.xlabel('Size')
# plt.ylabel('Frequency')
# plt.title('Distribution of Asteroids by Size')
# plt.show()