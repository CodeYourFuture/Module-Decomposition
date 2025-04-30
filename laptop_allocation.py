from dataclasses import dataclass
from enum import Enum
from typing import List
from typing import Dict

class OperatingSystem(Enum):
    MACOS = "macOS"
    ARCH = "Arch Linux"
    UBUNTU = "Ubuntu"

@dataclass(frozen=True)
class Person:
    name: str
    age: int
    # Sorted in order of preference, most preferred is first.
    preferred_operating_system: List[OperatingSystem]


@dataclass(frozen=True)
class Laptop:
    id: int
    manufacturer: str
    model: str
    screen_size_in_inches: float
    operating_system: OperatingSystem


def allocate_laptops(people: List[Person], laptops: List[Laptop]) -> dict[Person, Laptop]:
    allocation: dict[Person, Laptop] = {}
    unallocated_laptops = laptops[:]
    
    def calculate_sadness(person: Person, laptop: Laptop) -> int:
        if laptop.operating_system in person.preferred_operating_system:
            return person.preferred_operating_system.index(laptop.operating_system)
        return 100  # Sadness of 100 if the OS is not in the preferred list

    for person in people:
        best_laptop = None
        min_sadness = float('inf')
        
        for laptop in unallocated_laptops:
            sadness = calculate_sadness(person, laptop)
            if sadness < min_sadness:
                min_sadness = sadness
                best_laptop = laptop
        
        if best_laptop:
            allocation[person] = laptop
            unallocated_laptops.remove(best_laptop)
    
    if len(allocation) != len(people):
        raise ValueError("Not enough laptops to allocate one to each person.")
    
    return allocation




people = [
        Person(name="Daniel", age=34, preferred_operating_system=(OperatingSystem.UBUNTU, OperatingSystem.MACOS, OperatingSystem.ARCH)),
        Person(name="Maryam", age=36, preferred_operating_system=(OperatingSystem.MACOS, OperatingSystem.UBUNTU, OperatingSystem.ARCH)),
        Person(name="Saliou", age=36, preferred_operating_system=(OperatingSystem.MACOS, OperatingSystem.UBUNTU, OperatingSystem.UBUNTU)),
    ]

laptops = [
        Laptop(id=1, manufacturer="Dell", model="XPS", screen_size_in_inches=13, operating_system=OperatingSystem.ARCH),
        Laptop(id=2, manufacturer="Dell", model="XPS", screen_size_in_inches=15, operating_system=OperatingSystem.ARCH),
        Laptop(id=3, manufacturer="Dell", model="XPS", screen_size_in_inches=15, operating_system=OperatingSystem.UBUNTU),
        Laptop(id=4, manufacturer="Apple", model="macBook", screen_size_in_inches=13, operating_system=OperatingSystem.MACOS),
    ]
    

    