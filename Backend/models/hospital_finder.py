# Predefined maternity hospitals categorized by area
maternity_hospitals = {
    "Shivaji Nagar": [
        "ONP Leela Hospital - Shivaji Nagar", 
        "Jehangir Hospital - Shivaji Nagar",
        "Cloudnine Hospital - Shivaji Nagar"
    ],
    "Pimpri": [
        "Cloudnine Hospital - Pimpri", 
        "Aditya Birla Memorial Hospital - Pimpri",
        "Maternity & IVF Care Center - Pimpri",
        "Sterling Multispeciality Hospital - Pimpri"
    ],
    "Baner": [
        "Surya Mother and Child Care - Baner", 
        "LifeSpring Maternity Hospital - Baner",
        "Datar Hospital - Baner",
        "Rainbow Children's Hospital - Baner"
    ],
    "Kharadi": [
        "Motherhood Hospital - Kharadi", 
        "Columbia Asia Hospital - Kharadi",
        "Shree Hospital - Kharadi",
        "Cloudnine Hospital - Kharadi"
    ],
    "Wakad": [
        "Sanjeevani Hospital - Wakad", 
        "Lifepoint Hospital - Wakad",
        "Elite Maternity Hospital - Wakad",
        "Vighnaharta Hospital - Wakad"
    ],
    "Kothrud": [
        "Deoyani Hospital - Kothrud", 
        "Lata Maternity Hospital - Kothrud",
        "Sanjeevan Hospital - Kothrud",
        "Krishna Hospital - Kothrud"
    ],
    "Aundh": [
        "Medipoint Hospital - Aundh", 
        "Dhanwantari Hospital - Aundh",
        "Ace Hospital - Aundh",
        "AIMS Hospital - Aundh"
    ],
    "Hadapsar": [
        "Noble Hospital - Hadapsar", 
        "Sahyadri Super Speciality Hospital - Hadapsar",
        "Villoo Poonawalla Memorial Hospital - Hadapsar",
        "Vedant Hospital - Hadapsar"
    ],
    "Sinhagad Road": [
        "Ranka Hospital - Sinhagad Road", 
        "Shree Maternity & Nursing Home - Sinhagad Road"
    ],
    "Viman Nagar": [
        "Apollo Clinic - Viman Nagar", 
        "Cloudnine Hospital - Viman Nagar"
    ],
    "Nigdi": [
        "Lokmanya Hospital - Nigdi",
        "Sterling Multispeciality Hospital - Nigdi"
    ],
    "Koregaon Park": [
        "Ruby Hall Clinic - Koregaon Park",
        "Cloudnine Hospital - Koregaon Park"
    ],
    "Bavdhan": [
        "Om Hospital - Bavdhan",
        "Apollo Hospital - Bavdhan"
    ],
    "Camp": [
        "Inamdar Multispeciality Hospital - Camp",
        "Ruby Hall Clinic - Camp"
    ],
    "Warje": [
        "Sanjeevan Hospital - Warje",
        "Shraddha Hospital - Warje"
    ],
    "Swargate": [
        "Sanjeevani Hospital - Swargate",
        "Tilak Hospital - Swargate"
    ],
    "Katraj": [
        "Sai Sneh Hospital - Katraj",
        "Bhakare Super Speciality Hospital - Katraj"
    ],
    "Bhosari": [
        "Sant Dnyaneshwar Hospital - Bhosari",
        "Sterling Multispeciality Hospital - Bhosari"
    ],
    "Pashan": [
        "Pashan Hospital - Pashan",
        "Vitalife Clinic - Pashan"
    ],
    "Chinchwad": [
        "Niramaya Hospital - Chinchwad",
        "Dr. Dy Patil Hospital - Chinchwad"
    ],
    "Dhanori": [
        "Matoshree Hospital - Dhanori",
        "Dhanwantari Hospital - Dhanori"
    ],
    "Yerwada": [
        "Phoenix Hospital - Yerwada",
        "Sanjeevani Maternity Home - Yerwada"
    ],
    "Fursungi": [
        "Fursungi Hospital - Fursungi",
        "LifeCare Multispeciality Hospital - Fursungi"
    ]
}

def get_maternity_hospitals_nearby(area):
    """
    Fetches maternity hospitals near the given area from the predefined dictionary.
    
    :param area: The location where the user wants hospitals
    :return: List of maternity hospitals in that area
    """
    area = area.title()  # Convert to title case to match dictionary keys
    
    if area in maternity_hospitals:
        return maternity_hospitals[area]
    else:
        return ["No maternity hospitals found in this area."]
