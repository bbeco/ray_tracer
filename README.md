# A Typescript Ray Tracer

This is a simple ray tracer I am building for fun.
It is based on the recursive ray tracer described by Whitted's An Improved Illumination Model for Shaded Dysplay ([pdf](https://www.cs.drexel.edu/~david/Classes/CS586/Papers/p343-whitted.pdf)).

## How to build and run the project

This is written with [Typescript](https://www.typescriptlang.org/). I installed the typescript transpiler with [Yarn](https://yarnpkg.com/en/).
I also used [Webpack](https://webpack.js.org) to import different js modules.

I also used [Direnv](https://github.com/direnv/direnv) to correcly set up the export needed to use `tsc`.

In order to perform the tests, I used [Jest](https://jestjs.io/) and, in particular, [ts-jest](https://github.com/kulshekhar/ts-jest) to use it with typescript.