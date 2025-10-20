from dataclasses import dataclass
from enum import Enum
from typing import List

class OperatingSystem(Enum):
    MACOS= "macOS" 
    ARCH= "Arch Linux"
    UBUNTU= "Ubuntu"
    WINDOWS = "windows"

@dataclass(frozen=True)
class Person:
    name: str
    age: int
    preferred_operating_system: OperatingSystem

@dataclass(frozen=True)
class Laptop:
    id: 1
    manufacturer: str
    model: str
    screen_size_in_inches: float
    operating_system: OperatingSystem

laptops = [
    Laptop(id=1, manufacturer="Dell", model="XPS", screen_size_in_inches=13, operating_system=OperatingSystem.ARCH),
    Laptop(id=2, manufacturer="Dell", model="XPS", screen_size_in_inches=15, operating_system=OperatingSystem.UBUNTU),
    Laptop(id=3, manufacturer="Dell", model="XPS", screen_size_in_inches=15, operating_system=OperatingSystem.UBUNTU),
    Laptop(id=4, manufacturer="Apple", model="macBook", screen_size_in_inches=13, operating_system=OperatingSystem.MACOS),
]


def user_details():
    user_name = input("Please enter your name: ")
    user_age = int(input("Please enter your age: "))
    user_preferred_operating_system = input("Now tell us your preferred operating system in capital letters, 'MACOS', 'ARCH', or 'UBUNTU': ")

    os_in_enum = OperatingSystem[user_preferred_operating_system]
    
    return Person(name=user_name, age=user_age, preferred_operating_system=os_in_enum)


user = user_details()

def find_possible_laptops(laptops):
    possible_laptops = []

    print(user.preferred_operating_system)

    for laptop in laptops:
        if user.preferred_operating_system == laptop.operating_system:
            possible_laptops.append(laptop)

    return possible_laptops

def find_most_common_os(laptops: List[Laptop]) -> OperatingSystem:
    os_count = {}
    
    for laptop in laptops:
        os = laptop.operating_system
        os_count[os] = os_count.get(os, 0) + 1

    most_common_os = max(os_count.items(), key=lambda x: x[1])

    return most_common_os[0]

# find_possible_laptops(laptops)

def tell_user_outcome():
    possible_laptops = find_possible_laptops(laptops)
    most_common_os = find_most_common_os(laptops)


    if len(possible_laptops) >= 1:
        print(f"You're in luck, we have a laptop with your preferred os {user.preferred_operating_system.value}")
              
    elif any(laptop.operating_system == most_common_os for laptop in possible_laptops):
        print(f"You're in luck, we have a laptop with your preferred os {user.preferred_operating_system.value}, we also have laptops operating {most_common_os.value}")

    else:
        print(f"Sorry, there are no longer laptops with {user.preferred_operating_system.value} available, but we are in position to lend you one with {most_common_os.value}")


tell_user_outcome()