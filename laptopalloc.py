#import Python tools for structured data (dataclass), enumerations (Enum), and type hints (List, Dict)
from dataclasses import dataclass
from enum import Enum
from typing import List, Dict

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
    allocations: Dict[Person, Laptop] = {}  # store which laptop each person gets
    allocated_laptops = set()
    for person in people:
        # Try preferred operating systems in order
        for preferred_os in person.preferred_operating_system:
            # find the first unallocated laptop with this OS
            laptop = next(
                (l for l in laptops if l.operating_system == preferred_os and l.id not in allocated_laptops),
                None
            )
            if laptop:
                allocations[person] = laptop
                allocated_laptops.add(laptop.id)
                break  # stop checking once a laptop is assigned

        # Fallback: if no preferred OS laptop is available, assign any remaining laptop
        if person not in allocations:
            for laptop in laptops:
                if laptop.id not in allocated_laptops:
                    allocations[person] = laptop
                    allocated_laptops.add(laptop.id)
                    break

    return allocations


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