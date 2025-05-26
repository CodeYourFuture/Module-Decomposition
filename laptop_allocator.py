from dataclasses import dataclass
from enum import Enum
from typing import List, Dict, Tuple, Optional


class OperatingSystem(Enum):
    MACOS = "macOS"
    ARCH = "Arch Linux"
    UBUNTU = "Ubuntu"


@dataclass(frozen=True)
class Person:
    name: str
    age: int
    preferred_operating_system: Tuple[OperatingSystem, ...]


@dataclass(frozen=True)
class Laptop:
    id: int
    manufacturer: str
    model: str
    screen_size_in_inches: float
    operating_system: OperatingSystem


def calculate_sadness(person: Person, laptop: Laptop) -> int:
    try:
        return person.preferred_operating_system.index(laptop.operating_system)
    except ValueError:
        return 100 


def allocate_laptops(people: List[Person], laptops: List[Laptop]) -> Dict[Person, Laptop]:
    allocation: Dict[Person, Laptop] = {}
    available_laptops = laptops.copy()

    for person in people:
        best_laptop: Optional[Laptop] = None
        lowest_sadness = float('inf')

        for laptop in available_laptops:
            sadness = calculate_sadness(person, laptop)
            if sadness < lowest_sadness:
                lowest_sadness = sadness
                best_laptop = laptop

        if best_laptop:
            allocation[person] = best_laptop
            available_laptops.remove(best_laptop)

    return allocation


if __name__ == "__main__":
    people = [
        Person("Imran", 22, (OperatingSystem.UBUNTU, OperatingSystem.ARCH)),
        Person("Eliza", 34, (OperatingSystem.ARCH, OperatingSystem.MACOS))
    ]

    laptops = [
        Laptop(1, "Dell", "XPS", 13, OperatingSystem.ARCH),
        Laptop(2, "Dell", "XPS", 15, OperatingSystem.UBUNTU),
        Laptop(3, "Apple", "MacBook", 13, OperatingSystem.MACOS)
    ]

    allocation = allocate_laptops(people, laptops)

    for person, laptop in allocation.items():
        print(f"{person.name} gets Laptop #{laptop.id} with {laptop.operating_system.value}")
