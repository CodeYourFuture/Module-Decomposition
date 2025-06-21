from dataclasses import dataclass
from enum import Enum
from typing import List
import sys

class OperatingSystem(Enum):
    MACOS = "macOS"
    ARCH = "Arch Linux"
    UBUNTU = "Ubuntu"

    @staticmethod
    def from_string(value: str):
        for os in OperatingSystem:
            if os.value.lower() == value.strip().lower():
                return os
        raise ValueError(f"Sorry, we don't support that operating system: {value}")

@dataclass(frozen=True)
class Person:
    name: str
    age: int
    preferred_operating_system: OperatingSystem

@dataclass(frozen=True)
class Laptop:
    id: int
    manufacturer: str
    model: str
    screen_size_in_inches: float
    operating_system: OperatingSystem

def find_possible_laptops(laptops: List[Laptop], person: Person) -> List[Laptop]:
    return [laptop for laptop in laptops if laptop.operating_system == person.preferred_operating_system]

laptops = [
    Laptop(id=1, manufacturer="Dell", model="XPS", screen_size_in_inches=13, operating_system=OperatingSystem.ARCH),
    Laptop(id=2, manufacturer="Dell", model="XPS", screen_size_in_inches=15, operating_system=OperatingSystem.UBUNTU),
    Laptop(id=3, manufacturer="Dell", model="XPS", screen_size_in_inches=15, operating_system=OperatingSystem.UBUNTU),
    Laptop(id=4, manufacturer="Apple", model="macBook", screen_size_in_inches=13, operating_system=OperatingSystem.MACOS),
    Laptop(id=5, manufacturer="Apple", model="macBook Pro", screen_size_in_inches=15, operating_system=OperatingSystem.MACOS),
]

try:
    name = input("What's your name? ").strip()

    age_input = input("How old are you? ").strip()
    if not age_input.isdigit():
        raise ValueError("Age must be a number.")
    age = int(age_input)

    os_input = input("Which operating system do you like? (Ubuntu, Arch Linux, macOS): ").strip()
    preferred_os = OperatingSystem.from_string(os_input)

    person = Person(name=name, age=age, preferred_operating_system=preferred_os)

except ValueError as e:
    print(f"{e}", file=sys.stderr)
    sys.exit(1)

matching = find_possible_laptops(laptops, person)
print(f"\nHi {person.name}, we have {len(matching)} laptop(s) with {preferred_os.value}.")

os_counts = {os: 0 for os in OperatingSystem}
for laptop in laptops:
    os_counts[laptop.operating_system] += 1

most_available_os = max(os_counts, key=os_counts.get)
if most_available_os != preferred_os and os_counts[most_available_os] > len(matching):
    print(f"We have more laptops with {most_available_os.value}.")
    print(f"If you're okay with using {most_available_os.value}, you might get one faster.")
