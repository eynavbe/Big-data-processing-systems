import requests
import matplotlib.pyplot as plt
import pandas as pd
import sys

def fetch_neo_data_last_month(before,today):
        url = 'https://api.nasa.gov/neo/rest/v1/feed?start_date='+str(before)+'&end_date='+str(today)+'&api_key=ooqrJ7oyx9tkTMLbwEYlTV5nrhx9vTsSPuCFlHpb'
        response = requests.get(url)
        data = response.json()
        return data

def create_asteroid_distribution_graph(neo_data):
    size_counts = {}
    for date in neo_data['near_earth_objects']:
        for neo in neo_data['near_earth_objects'][date]:
            min_diameter = neo['estimated_diameter']['kilometers']['estimated_diameter_min']
            max_diameter = neo['estimated_diameter']['kilometers']['estimated_diameter_max']
            size_range = determine_size_range(min_diameter, max_diameter)
            if size_range in size_counts:
                size_counts[size_range] += 1
            else:
                size_counts[size_range] = 1
    sizes = list(size_counts.keys())
    counts = list(size_counts.values())
    return sizes, counts
    

def determine_size_range(min_diameter, max_diameter):
    avg_diameter = (min_diameter + max_diameter) / 2
    if avg_diameter < 0.5:
        return 'Small'
    elif avg_diameter < 1.5:
        return 'Medium'
    else:
        return 'Large'

def fetch_neo_data_next_24_hours():
    today = pd.Timestamp.now().date()
    tomorrow = today + pd.Timedelta(days=1)
    url = 'https://api.nasa.gov/neo/rest/v1/feed?start_date='+str(today)+'&end_date='+str(tomorrow)+'&api_key=ooqrJ7oyx9tkTMLbwEYlTV5nrhx9vTsSPuCFlHpb'
    response = requests.get(url)
    data = response.json()
    return data

def display_neo_table(neo_data):
    neo_list = []
    for date in neo_data['near_earth_objects']:
        neo_list.extend(neo_data['near_earth_objects'][date])

    table_data = {
        'Name': [],
        'Estimated Diameter (min)': [],
        'Estimated Diameter (max)': [],
        'Close Approach Date': [],
        'Miss Distance (kilometers)': [],
        'Relative Velocity (kilometers per hour)': []
    }

    for neo in neo_list:
        name = neo['name']
        diameter_min = neo['estimated_diameter']['kilometers']['estimated_diameter_min']
        diameter_max = neo['estimated_diameter']['kilometers']['estimated_diameter_max']
        close_approach_date = neo['close_approach_data'][0]['close_approach_date']
        miss_distance = neo['close_approach_data'][0]['miss_distance']['kilometers']
        relative_velocity = neo['close_approach_data'][0]['relative_velocity']['kilometers_per_hour']

        table_data['Name'].append(name)
        table_data['Estimated Diameter (min)'].append(diameter_min)
        table_data['Estimated Diameter (max)'].append(diameter_max)
        table_data['Close Approach Date'].append(close_approach_date)
        table_data['Miss Distance (kilometers)'].append(miss_distance)
        table_data['Relative Velocity (kilometers per hour)'].append(relative_velocity)

    df = pd.DataFrame(table_data)
    print(table_data)

    return table_data


def neo_data_last_month():
    sizes = []
    counts = []
    today = pd.Timestamp.now().date()
    before = (today - pd.DateOffset(months=1)).date()
    neo_data_last_month = {}
    date_range = pd.date_range(before, today, freq='7D')
    for start_date, end_date in zip(date_range[:-1], date_range[1:]):
        start_date = start_date.date()
        end_date = end_date.date()
        neo_data_last_month = fetch_neo_data_last_month(start_date,end_date)

        size,count = create_asteroid_distribution_graph(neo_data_last_month)
        sizes.extend(size)
        counts.extend(count)
    print(sizes)
    print(counts)
    return sizes, counts

def neo_data_next_24_hours():
    neo_data_next_24_hours = fetch_neo_data_next_24_hours()

    df = display_neo_table(neo_data_next_24_hours)
    return df

def main():
    func_choose = sys.argv[1]
    if func_choose == 'neo_data_next_24_hours':
        df = neo_data_next_24_hours()
        print(df)
    
    if func_choose == 'neo_data_last_month':
        sizes , counts = neo_data_last_month()
        print(sizes)
        print(counts)



if __name__ == '__main__':
    main()
# neo_data_next_24_hours()
# sizes , counts = neo_data_last_month()

# plt.bar(sizes, counts)
# plt.xlabel('Size Range')
# plt.ylabel('Count')
# plt.title('Asteroid Distribution by Size')
# plt.show()



