
import numpy as np
import sys
from astroquery.simbad import Simbad
from astropy.coordinates import SkyCoord
from astropy import units as u


def main():
    utc = sys.argv[1]
    ra = sys.argv[2]
    dec = sys.argv[3]

    target_coords = SkyCoord(ra, dec, unit=(u.hourangle, u.deg))

    custom_simbad = Simbad()
    custom_simbad.add_votable_fields('otype(V)', 'plx', 'rv_value', 'flux(U)', 'flux(B)', 'flux(V)')

    result_table = None
    try:
        result_table = custom_simbad.query_region(target_coords, radius=5 * u.arcmin)
    except Exception as e:
        print(f"An error occurred while querying SIMBAD: {str(e)}")

    if result_table is not None and len(result_table) > 0:
        coords_table = SkyCoord(result_table['RA'], result_table['DEC'], unit=(u.deg, u.deg))
        separations = target_coords.separation(coords_table)

        closest_idx = np.argmin(separations)

        closest_object = result_table[closest_idx]
        object_name = closest_object['MAIN_ID']
        object_type = closest_object['OTYPE_V']
        parallax = closest_object['PLX_VALUE']
        radial_velocity = closest_object['RV_VALUE']
        flux_u = closest_object['FLUX_U']
        flux_b = closest_object['FLUX_B']
        flux_v = closest_object['FLUX_V']

        result_str = f"Object Name: {object_name}\n" \
                     f"Object Type: {object_type}\n" \
                     f"RA: {ra}\n" \
                     f"DEC: {dec}\n" \
                     f"Parallax: {parallax} mas\n" \
                     f"Radial Velocity: {radial_velocity} km/s\n" \
                     f"Flux U: {flux_u} mag\n" \
                     f"Flux B: {flux_b} mag\n" \
                     f"Flux V: {flux_v} mag\n"
        print(result_str)
    else:
        print("No astronomical object found for the given coordinates.")

if __name__ == '__main__':
    main()