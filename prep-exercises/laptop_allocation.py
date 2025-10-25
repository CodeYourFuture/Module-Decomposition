from dataclasses import dataclass
from enum import Enum
from typing import List, Dict

class OperatingSystem(Enum):
    MACOS = "macOS"
    ARCH = "Arch Linux"
    UBUNTU = "Ubuntu"

@dataclass(frozen=True)
class Person:
    name: str
    age: int
    # Sorted in order of preference, most preferred is first.
    # Using tuple instead of List to make Person hashable (for dict keys)
    preferred_operating_system: tuple[OperatingSystem, ...]


@dataclass(frozen=True)
class Laptop:
    id: int
    manufacturer: str
    model: str
    screen_size_in_inches: float
    operating_system: OperatingSystem


def calculate_sadness(person: Person, laptop: Laptop) -> int:
    """Calculate sadness score for a person-laptop pairing."""
    try:
        return person.preferred_operating_system.index(laptop.operating_system)
    except ValueError:
        return 100


def allocate_laptops(people: List[Person], laptops: List[Laptop]) -> Dict[Person, Laptop]:
    """
    Allocate laptops to people minimizing total sadness.
    
    Sadness is defined as:
    - Index in preference list (0 for first choice, 1 for second, etc.)
    - 100 if the OS is not in their preference list
    """
    if len(people) != len(laptops):
        raise ValueError("Number of people must equal number of laptops")
    
    # Greedy approach: Sort people by how limited their good options are
    # Then allocate their best available choice
    allocation: Dict[Person, Laptop] = {}
    available_laptops = list(laptops)
    
    # Create a priority queue of (person, laptop, sadness) tuples
    # Sort by sadness to allocate best matches first
    preferences = []
    for person in people:
        for laptop in available_laptops:
            sadness = calculate_sadness(person, laptop)
            preferences.append((sadness, person, laptop))
    
    preferences.sort(key=lambda x: x[0])
    
    # Greedy allocation: try to give everyone their best available choice
    allocated_people = []
    allocated_laptops = []
    
    for sadness, person, laptop in preferences:
        if person not in allocated_people and laptop not in allocated_laptops:
            allocation[person] = laptop
            allocated_people.append(person)
            allocated_laptops.append(laptop)
            
            if len(allocation) == len(people):
                break
    
    return allocation


def calculate_total_sadness(allocation: Dict[Person, Laptop]) -> int:
    """Calculate total sadness for an allocation."""
    return sum(calculate_sadness(person, laptop) for person, laptop in allocation.items())


# Test the function
people = [
    Person("Alice", 25, (OperatingSystem.UBUNTU, OperatingSystem.ARCH, OperatingSystem.MACOS)),
    Person("Bob", 30, (OperatingSystem.MACOS, OperatingSystem.UBUNTU)),
    Person("Charlie", 28, (OperatingSystem.ARCH, OperatingSystem.UBUNTU)),
]

laptops = [
    Laptop(1, "Dell", "XPS", 13, OperatingSystem.UBUNTU),
    Laptop(2, "Apple", "MacBook", 13, OperatingSystem.MACOS),
    Laptop(3, "Lenovo", "ThinkPad", 14, OperatingSystem.ARCH),
]

allocation = allocate_laptops(people, laptops)

print("Laptop Allocation:")
for person, laptop in allocation.items():
    sadness = calculate_sadness(person, laptop)
    print(f"{person.name} -> {laptop.manufacturer} {laptop.model} ({laptop.operating_system.value}) - Sadness: {sadness}")

print(f"\nTotal Sadness: {calculate_total_sadness(allocation)}")

