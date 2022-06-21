cmake_minimum_required(VERSION 3.21)
project(cf)

set(CMAKE_CXX_STANDARD 14)

include_directories(.)

add_executable(cf
        debug.h
        solution.cpp)
