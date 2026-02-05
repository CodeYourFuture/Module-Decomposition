class Person:
    def __init__(self, name: str, age: int, preferred_operating_system: str):
        self.name = name
        self.age = age
        self.preferred_operating_system = preferred_operating_system

    def is_adult(self):
        return self.age >= 18

imran = Person("Imran", 22, "Ubuntu")
print(imran.is_adult())

#✍️exercise
#Think of the advantages of using methods instead of free functions. Write them down in your notebook.


#answer
#Reusability
#Polymorphism – Different subclasses can override the same method name with different behaviour.


#exercise
#Change the Person class to take a date of birth (using the standard library’s datetime.date class) and store it in a field instead of age.
from datetime import date
class Person:
    def __init__(self, name: str, date_of_birth: date, preferred_operating_system: str):
        self.name = name
        self.date_of_birth = date_of_birth
        self.preferred_operating_system = preferred_operating_system

    def is_adult(self) -> bool:
        today = date.today()
        age = today.year - self.date_of_birth.year
        if (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day):
            age -= 1
        return age >= 18
#example 
imra = Person("Imra", date(2003, 7, 14), "Ubuntu")
eliz = Person("Eliz", date(1991, 3, 25), "Arch Linux")

print(imra.is_adult())  
print(eliz.is_adult())  
