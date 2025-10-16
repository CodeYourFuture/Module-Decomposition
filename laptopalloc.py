#import Python tools for structured data (dataclass), enumerations (Enum), and type hints (List, Dict)
from dataclasses import dataclass
from enum import Enum
from typing import List, Dict, Tuple
#Define a fixed set of operating systems as an enum to avoid typos and enforce valid values
class OperatingSystem(Enum):
    MACOS = "macOS"
    ARCH = "Arch Linux"
    UBUNTU = "Ubuntu"
#Rep a person with a name, age, and ordered preferences of operating systems(immutable)
@dataclass(frozen=True)
class Person:
    name: str
    age: int
    preferred_operating_system: tuple[OperatingSystem, ...]

#Repr a laptop with identifying info, screen size, and its operating system
@dataclass(frozen=True)
class Laptop:
    id: int
    manufacturer: str
    model: str
    screen_size_in_inches: float
    operating_system: OperatingSystem

#Main function to assign exactly one laptop per person while minimizing “sadness”
def allocate_laptops(people: List[Person], laptops: List[Laptop]) -> Dict[Person, Laptop]:
    sadness_list: List[Tuple[int, Person, Laptop]] = []
    #Compute sadness for each laptop for each person (0 = best match, 100 = not preferred)
    for person in people:
        for laptop in laptops:
            if laptop.operating_system in person.preferred_operating_system:
                sadness = person.preferred_operating_system.index(laptop.operating_system)
            else:
                sadness = 100
            sadness_list.append((sadness, person, laptop))

# Sort by sadness (lowest first)
    sadness_list.sort(key=lambda x: x[0])
#Track assigned laptops and people to ensure uniqueness
    allocations: Dict[Person, Laptop] = {}
    allocated_laptops = set()

#Greedily allocate laptops to minimise sadness
    for sadness, person, laptop in sadness_list:
        if person not in allocations and laptop.id not in allocated_laptops:
            allocations[person] = laptop
            allocated_laptops.add(laptop.id)

    return allocations






#example usage
people = [
    Person("Imran", 22, (OperatingSystem.UBUNTU, OperatingSystem.ARCH, OperatingSystem.MACOS)),
    Person("Eliza", 34, (OperatingSystem.ARCH, OperatingSystem.UBUNTU)),
]
laptops = [
    Laptop(1, "Dell", "XPS 13", 13, OperatingSystem.ARCH),
    Laptop(2, "Apple", "MacBook", 13, OperatingSystem.MACOS),
    Laptop(3, "Dell", "XPS 15", 15, OperatingSystem.UBUNTU),
]
allocations = allocate_laptops(people, laptops)
for person, laptop in allocations.items():
    print(f"{person.name} gets {laptop.manufacturer} {laptop.model} ({laptop.operating_system.value})")