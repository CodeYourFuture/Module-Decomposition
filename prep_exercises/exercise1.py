def double(value):
    return value * 2

print(double("22"))
#Predict what double("22") will do

#Answer
#"2222" because "22" will be treated as a string and then the program just duplicates it and return 2222 with a string value

def double(number):
    return number * 3

print(double(10))

#find the bug
#answer
#This is a logic error instead of giving the double it returns the triple of the number 
#we can improve it by changing 3 by 2 since it doesnt have any type error
