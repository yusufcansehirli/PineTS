---
layout: default
title: Language Coverage
nav_order: 10
permalink: /lang-coverage/
---

# PineTS Language Coverage

This document lists the features of the PineTS language and their status.

| Feature                | Status      | Comments                                                                |
| ---------------------- | ----------- | ----------------------------------------------------------------------- |
| Execution model        | done        | Core Pine Script language features, execution, and transpiler           |
| Time series            | done        | Variables behave like Pine Script time series (array annotation access) |
| Script structure       | done        | Syntax closely matches Pine Script where possible                       |
| Identifiers            | native      | Uses native JS/TS identifiers                                           |
| Operators              | native      | Uses native JS/TS operators                                             |
| Variables declarations | done        | Supports time series and variable syntaxes                              |
| Conditional structures | done        | if / switch implemented and covered by regression tests                 |
| Loops                  | done        | for / while / for-in all supported                                      |
| Type system            | native      | Uses native JS/TS types                                                 |
| Builtins               | done        | Implemented open, close, high, low, hl2, hlc3, ohlc4                    |
| Functions              | done        | Check [api-coverage](api-coverage.md) for details                       |
| UDT                    | done        | Check [api-coverage](api-coverage.md) for details                       |
| Objects                | done        | UDTs: field defaults, persistent (var) fields, UDT methods              |
| Enums                  | done        | Check [api-coverage](api-coverage.md) for details                       |
| Methods                | done        | Overload dispatch + per-receiver-type implementations                   |
| Arrays                 | done        | Check [api-coverage](api-coverage.md) for details                       |
| Matrices               | done        | Check [api-coverage](api-coverage.md) for details                       |
| Maps                   | done        | Check [api-coverage](api-coverage.md) for details                       |
| Imports                | done        | Registry-based: host provides resolved library exports via setLibraries(); a missing library raises a clear error on first use |
