this.i18n = {
  CholeskyDecomposition: "Cholesky decomposition",
  CholeskyDecompositionLink: "<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Cholesky_decomposition\">(?)</a>",
  JordanDecomposition: "Jordan decomposition",
  JordanDecompositionLink: "<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Generalized_eigenvector#Computation_of_generalized_eigenvectors\">(?)</a>",
  JordanMatrix: "A matrix J in Jordan normal form (a matrix from <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Jordan_matrix\">Jordan blocks</a> corresponding to selected chains):",
  More: "More:",
  aBasisForTheSolutionSet: "A basis for the solution set:",
  addAppToHomescreen: "Add app to homescreen",
  addTableToInputMatrix: "Add a table to input a matrix",
  algebraicMultiplicity: "algebraic multiplicity",
  analyseCompatibilityOfTheSystem: "Analyse consistency of the system:",
  answer: "Answer:",
  applyDifferenceOfCubesRuleLink: "<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Factorization#Recognizable_patterns\">(?)</a>",
  applyDifferenceOfNthPowersRuleLink: "<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Factorization#Recognizable_patterns\">(?)</a>",
  applyDifferenceOfSquaresRuleLink: "<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Difference_of_two_squares\">(?)</a>",
  binomialTheoremLink: "<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Binomial_theorem\">(?)</a>",
  determinant2x2Link: "<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Determinant#2_×_2_matrices\">(?)</a>",
  determinantLeibnizLink: "<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Leibniz_formula_for_determinants\">(?)</a>",
  direction: "ltr",
  eigenvalueEquationLink: "<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Eigenvalues_and_eigenvectors#Eigenvalues_and_the_characteristic_polynomial\">*</a>",
  examples: {
    pageTitle: "Examples of solvings",
    pageDescription: "Usage examples of the matrix calculator",
    item1: {
      header: "Compute the determinant:",
      a: "a) by expanding along the i-th row;",
      b: "b) by expanding down the j-th column;",
      c: "c) first obtaining zeros in the i-th row.",
      howto: {
        common: "For a solution you could use the page \"<a href=\"./det.html\>${menu.determinantCalculation}</a>\:",
        a: "a) You should enter in the input field near the button \"Expand aloght the row\" the row number - <code>1</code>. Then click this button. The solution will appear below.",
        b: "b) You should enter in the input field near the button \"Expand aloght the column\" the column number - <code>2</code>. Then click this button. The solution will appear below.",
        c: "c) You should enter in the input field near the button \"Get zeros in the row\" the row number - <code>1</code>. Then click this button. The solution will appear below."
      }
    },
    item2: {
      header: "Evaluate a matrix expression to find the matrix K:",
      howto: {
        start: "To find the solution it is possible to use the page \"<a href=\"./\>${menu.matrixOperations}</a>\:",
        step1: "Find on the page a <a href=\"./#add-table\">button which adds matrix input tables</a>, press it two times to get the input fields for matrices C and D.",
        step2: "Enter the matrix A into the table \"Matrix A\", the matrix B into the table \"Matrix B\", the matrix C into the table \"Matrix C\", the matrix D into the table \"Matrix D\".",
        step3: "Then enter the expression <code>3AB-2CD</code> into the <a href=\"./#expression\">expression input field</a> and press the button \"=\" next to the field.",
        step4: "The result will appear below on the page."
      }
    },
    item3: {
      header: "A problem. The enterprise lets out three kinds of production, using raw material of three types. Charges of each type of raw material by kinds of production and stocks of raw material at the enterprise are given in the table. To define volume of output of each kind at the set stocks of raw material.",
      rawMaterialType: "Type of raw material",
      rawMaterialConsumptionByProductType: "Charge of raw material by kinds of production, weight/num.",
      rawMaterialStock: "Stock of raw material, weight units",
      howto: {
        makeSystemOfEquations: "Let's make a system of the equations:",
        start: "Let's use the page \"<a href=\"./slu.html\">${menu.solvingSystemsOfLinearEquations}</a>\" to find the solution:",
        step1: "Put the coefficients of the system into the input fields.",
        step2: "Then press the button \"${solveByCrammer}.\""
      }
    }
  },
  exponential: {
    findAMatrixInJordanNormalForm: "Find a matrix in Jordan normal form:",
    then: "Then:",
    findTheExponentialOfTheNilpotentMatrixN: "Find the exponential of the nilpotent matrix ${N}:",
    exponentialOfNilpotentMatrixLink: "<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Matrix_exponential#Nilpotent_case\">(*)</a>",
    findTheExponentialOfTheDiagonalMatrixD: "Find the exponential of the diagonal matrix ${D}:",
    exponentialOfDiagonalMatrix: "Exponential can be obtained by exponentiating each entry on the main diagonal <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Matrix_exponential#Diagonalizable_case\">(*)</a>:"
  },
  externalLinks: " ",
  forSolutionUsingCramersRuleNumberOfEquationsShouldBeEqualNumberOfVariables: "For the solution using Cramer's rule the number of equations should be equal to the number of variables.",
  identityMatrixDenotation: "I",
  menu: {
    matrixOperations: "Matrix calculator",
    solvingSystemsOfLinearEquations: "Solving systems of linear equations",
    determinantCalculation: "Determinant calculator",
    examples: "Examples",
    eigenvalues: "Eigenvalues calculator",
    wiki: "<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Matrix_(mathematics)\">Wikipedia:Matrices</a>"
  },
  index: {
    indexTitle: "Matrix calculator",
    indexShortDescription: "Matrix operations, eigenvalues and eigenvectors, solving of systems of equations",
    indexDescription: "Matrix addition, multiplication, inversion, determinant and rank calculation, transposing, bringing to diagonal, triangular form, exponentiation, solving of systems of linear equations with solution steps.",
    swapMatrices: "Swap matrices",
    multiplyMatrices: "Matrix multiplication",
    addMatrices: "Matrix addition",
    subtractBFromA: "Matrix subtraction",
    indexIntro1: "With help of this calculator you can: find the matrix determinant, the rank, raise the matrix to a power, find the sum and the multiplication of matrices, calculate the inverse matrix. Just type matrix elements and click the button.",
    findDeterminant: "Find the determinant",
    findInverse: "Find the inverse",
    findTranspose: "Transpose",
    findRank: "Find the rank",
    multiplyBy: "Multiply by",
    triangularMatrix: "Triangular matrix",
    diagonalMatrix: "Diagonal matrix",
    exponentiation: "Raise to the power of",
    LUDecomposition: "LU-decomposition",
    enterExpression: "Expression input field"
  },
  close: "Close",
  matrix: "Matrix",
  keyEnter: "Enter",
  advices: {
    leaveExtraCellsEmpty: "Leave extra cells <i>empty</i> to enter non-square matrices.",
    youCanUseDecimalFractions: "You can use decimal (finite and periodic) fractions: ${listOfExamples}; or arithmetic expressions: ${listOfComplexExamples}.",
    useKeyboardKeysToNavigate: "Use ${keyboardKeysList} to navigate between cells, <kbd>Ctrl</kbd>+<kbd>C</kbd>/<kbd>Ctrl</kbd>+<kbd>V</kbd> to copy/paste matrices.",
    dragAndDropMatrices: "<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Drag_and_drop\">Drag-and-drop</a> matrices from the results, or even from/to a text editor.",
    toLearnMoreUseWikipedia: "To learn more about matrices use <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Matrix_(mathematics)\">Wikipedia</a>."
  },
  augmentedMatrixOfTheSystem: "The <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Augmented_matrix\">augmented matrix</a> of the system:",
  clear: "Clean",
  inverse2x2Link: "<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Invertible_matrix#Inversion_of_2_×_2_matrices\">*</a>",
  inverseDetailsUsingAdjugateMatrixLink: "<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Invertible_matrix#Analytic_solution\">(?)</a>",
  adjugateMatrixLink: "<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Adjugate_matrix#Definition\">(?)</a>",
  colonSpacing: "",
  decimalSeparator: ".",
  keyDelete: "Delete",
  keyboardKeysList: "<kbd>↵ ${keyEnter}</kbd>, <kbd>${keySpace}</kbd>, <kbd>←</kbd>, <kbd>→</kbd>, <kbd>↑</kbd>, <kbd>↓</kbd>, <kbd>⌫</kbd>, and <kbd>${keyDelete}</kbd>",
  languageName: "English",
  letsSolveHomogeneouseSystem: "So we have a <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/System_of_linear_equations#Homogeneous_systems\">homogeneous system</a> of linear equations, we solve it by Gaussian Elimination:",
  methodOfKroneckerLink: "<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Factorization_of_polynomials#Kronecker%27s_method\">(?)</a>",
  nthRootUsingDiagonalizationLink: "<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Square_root_of_a_matrix#By_diagonalization\">(?)</a>",
  numberOfDecimalPlaces: "number of decimal places",
  matricesShouldHaveSameDimensions: "Matrices must be of the same size.",
  findEigenvaluesFromTheCharacteristicPolynomial: "Find eigenvalues from the <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Characteristic_polynomial\">characteristic polynomial</a>:",
  polynomials: {
    pageTitle: "Polynomials",
    pageDescription: "Polynomial roots calculator",
    expandAndFindRoots: "Expand (and find the roots)",
    multiplyTwoPolynomials: "Multiply two polynomials"
  },
  powUsingDiagonalizationLink: "<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Diagonalizable_matrix#An_application\">(?)</a>",
  powUsingJordanNormalFormLink: "<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Matrix_function#Jordan_decomposition\">(?)</a>",
  removeTable: "Remove the table",
  slu: {
    showExampleOfSystemInput: "Show how to input the following system:",
    sluDescription: "System of linear equations calculator - solve system of linear equations step-by-step, Gaussian elimination, Cramer's rule, inverse matrix method, analysis for compatibility",
    sluHeader: "System of linear equations calculator",
    sluIntro: {
      about: "This calculator solves <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/System_of_linear_equations\">Systems of Linear Equations</a> using <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Gaussian_elimination\">Gaussian Elimination Method</a>, <a rel=\"noopener\" href=\"https://www.mathportal.org/algebra/solving-system-of-linear-equations/inverse-matrix-method.php\">Inverse Matrix Method</a>, or <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/System_of_linear_equations#Cramer%27s_rule\">Cramer's rule</a>. Also you can compute a number of solutions in a system of linear equations (analyse the compatibility) using <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Rouché–Capelli_theorem\">Rouché–Capelli theorem</a>.",
      howTo: "Enter coefficients of your system into the input fields. Leave cells empty for variables, which do not participate in your equations. To input fractions use <code>/</code>: <code>1/3</code>.",
      wiki: null,
      wikiLang: "en"
    },
    sluTitle: "Solving Systems of linear equations",
    testForConsistency: "Test For Compatibility"
  },
  det: {
    detTitle: "Matrix determinant calculator",
    detDescription: "Determinant evaluation by using row reductions to create zeros in a row/column or using the expansion by minors along a row/column step-by-step",
    detHeader: "Determinant calculation by expanding it on a line or a column, using Laplace's formula",
    detIntro: "This page allows to find the determinant of a matrix using <a rel=\"noopener\" href=\"http://mathforum.org/library/drmath/view/51968.html\">row reductions</a> or <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Laplace_expansion\">expansion by minors</a>.",
    expandByColumn: "Expand along the column",
    expandByRow: "Expand along the row",
    obtainZerosInColumn: "Get zeros in the column",
    obtainZerosInRow: "Get zeros in the row"
  },
  vectors: {
    vectorsTitle: "Eigenvalues and Eigenvectors",
    vectorsDescription: "Calculator of eigenvalues and eigenvectors",
    vectorsHeader: "Finding of eigenvalues and eigenvectors",
    vectorsIntro: "This calculator allows to find <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Eigenvalues_and_eigenvectors\">eigenvalues and eigenvectors</a> using the <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Characteristic_polynomial\">Characteristic polynomial</a>.",
    vectorsFind: "Find"
  },
  cells: "Cells",
  findEigenvectorsForEveryEigenvalue: "For every &lambda; we find its own vector(s):",
  keySpace: "Space",
  displayDecimal: "Display decimals",
  determinantIsEqualToZeroTheMatrixIsSingularNotInvertible: "The determinant is 0, the matrix is not <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Invertible_matrix\">invertible</a>.",
  inputError: "Please check entered data (you can use decimal numbers and expressions such as ${listOfExamples}, ${listOfComplexExamples})",
  matrixIsNotSquare: "The matrix is not square",
  divisionByZeroError: "Division by zero",
  exponentIsNegative: "The exponent is negative",
  or: "or",
  showText: "Show as plain text",
  showMathML: "Show MathML",
  showImage: "Show as image",
  showComments: "Comments",
  tweet: "Tweet",
  share: "Share",
  notEnoughRationalEigenvalues: "Not Enough Rational Eigenvalues",
  solveByCrammer: "Solve by Cramer's rule",
  solveByInverse: "Solve using the inverse matrix",
  solveByGauss: "Solve by Gaussian elimination",
  solveByJordanGauss: "Solve by Gauss–Jordan elimination",
  usingSarrusRule: "Using <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Rule_of_Sarrus\">Sarrus' rule</a>",
  theRuleOfSarrusCanBeUsedOnlyWith3x3Matrices: "The rule of Sarrus can be used only with 3×3 matrices.",
  notDiagonalizable: "The matrix is not diagonalizable, because it does not have ${n} <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Linear_independence#Evaluating_linear_independence\">linearly independent</a> eigenvectors.",
  analyseCompatibilityIntroduction: "Apply <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Rouché–Capelli_theorem\">Rouché–Capelli theorem</a> to compute the number of solutions.",
  convertTheAugmentedMatrixIntoTheRowEchelonForm: "Convert the <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Augmented_matrix\">augmented matrix</a> into the row echelon form:",
  determineEachJordanChain: "Determine each Jordan chain:",
  determineTheMaximalRankOfGeneralizedEigenvectors: "Determine the maximal rank of generalized eigenvectors:",
  eigenvalue: "Eigenvalue",
  exponentialUsingJordanCanonicalFormLink: "<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Matrix_exponential#Using_the_Jordan_canonical_form\">Matrix exponential using the Jordan canonical form</a>",
  findAMatrixInJordanNormalFormSimilarToOriginal: "Find a matrix in Jordan normal form, <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Matrix_similarity\">similar to original</a>",
  findLinearlyIndependentGeneralizedEigenvectorsForEveryEigenvalue: "Find linearly independent generalized eigenvectors for every eigenvalue:",
  findSolutionsOfX: "Find solutions of ${X}:",
  fundamentalSystem: "The solution set:",
  generalSolution: "<a rel=\"noopener\" href=\"https://math.stackexchange.com/questions/299870/find-the-general-form-of-the-solution-to-the-system-of-equations-below\">General Solution</a>:",
  insertIn: "Insert in",
  theNumberOfColumnsInFirstMatrixShouldEqualTheNumberOfRowsInSecond: "The number of columns in the first matrix should be equal to the number of rows in the second.",
  summaryLabel: "Details",
  forSolutionUsingCramersRuleCoefficientMatrixShouldHaveNonZeroDeterminant: "For the solution using <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Cramer%27s_rule\">Cramer's rule</a> the coefficient matrix should have a nonzero determinant.",
  solutionByRuleOfCramer: "Solution by <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Cramer%27s_rule\">Cramer's rule</a>",
  solutionByInverseMatrixMethod: "Solution by <a rel=\"noopener\" href=\"https://www.mathportal.org/algebra/solving-system-of-linear-equations/inverse-matrix-method.php\">Inverse Matrix Method</a>",
  solutionByGaussianElimination: "Solution by <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Gaussian_elimination\">Gaussian elimination</a>",
  solutionByGaussJordanElimination: "Solution by <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Gaussian_elimination\">Gauss-Jordan elimination</a>",
  fromEquationIFindVariable: "Find the variable ${x} from the equation ${i} of the system ${#system_1}:",
  generalizedModalMatrix: "<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Modal_matrix#Generalized_modal_matrix\">Generalized modal matrix</a> (the columns of M are the generalized eigenvectors of selected chains in reverse order - ${links}):",
  generateAJordanChainForThisGeneralizedEigenvector: "Generate a Jordan Chain for this generalized eigenvector:",
  itIsAGeneralizedEigenvector: "It is a generalized eigenvector.",
  itIsNotAGeneralizedEigenvector: "It is not a generalized eigenvector.",
  theSystemIsConsistentAndItHasAUniqueSolution: "The rank of the <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Augmented_matrix\">augmented matrix</a> is equal to the rank of the <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Coefficient_matrix\">coefficient matrix</a> of the system, and is equal to the number of variables. The system is consistent and the <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Rouché–Capelli_theorem\">solution is unique</a>.",
  theSystemIsConsistentAndItHasInfiniteNumberOfSolutions: "The rank of the <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Augmented_matrix\">augmented matrix</a> is equal to the rank of the <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Coefficient_matrix\">coefficient matrix</a> of the system, and is less than the number of variables. The system is consistent and there is an <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Rouché–Capelli_theorem\">infinite number of solutions</a>.",
  theSystemIsInconsistent: "The rank of the <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Augmented_matrix\">augmented matrix</a> is not equal to the rank of the <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Coefficient_matrix\">coefficient matrix</a> of the system. The system is inconsistent (<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Rouché–Capelli_theorem\">has no solution</a>).",
  thereAreNoRationalSolutions: "There are no rational solutions.",
  toSolveSystemByInverseMatrixMethodCoefficientMatrixShouldHaveNonZeroDeterminant: "To solve the system by <a rel=\"noopener\" href=\"https://www.mathportal.org/algebra/solving-system-of-linear-equations/inverse-matrix-method.php\">Inverse Matrix Method</a> the coefficient matrix should have a nonzero determinant.",
  thereAreNoSolutions: "There are no solutions.",
  language: "Language",
  copyToClipboard: "Copy",
  inverse2x2: "Find 2×2 matrix inverse according to the formula:",
  ruleOfSarrus: "Rule of Sarrus",
  ruleOfSarrusLink: "<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Rule_of_Sarrus\">(?)</a>",
  ruleOfTriangle: "Triangle's rule",
  ruleOfTriangleLink: "<a rel=\"noopener\" href=\"http://m-hikari.com/ija/ija-password-2009/ija-password5-8-2009/hajrizajIJA5-8-2009.pdf#page=3\">(?)</a>",
  formulaOfLeibniz: "Leibniz formula",
  matrixMultiplication: "Matrix multiplication",
  matrixMultiplicationInfo: "<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Matrix_multiplication\">Matrix multiplication</a>: the rows of the first matrix are multiplied by the columns of the second one.",
  solutionByMethodOfMontante: "Solution by <a rel=\"noopener\" href=\"https://es.wikipedia.org/wiki/Método_Montante\">Montante's Method (Bareiss algorithm)</a>",
  methodOfGauss: "Gaussian elimination",
  methodOfGaussJordan: "Gauss–Jordan elimination",
  inverseDetailsUsingAdjugateMatrix: "Using the adjugate matrix",
  methodOfMontante: "Montante's method (Bareiss algorithm)",
  listOfExamples: "<code dir=\"ltr\">1/3</code>, <code dir=\"ltr\">3.14</code>, <code dir=\"ltr\">-1.3(56)</code>, or <code dir=\"ltr\">1.2e-4</code>",
  listOfComplexExamples: "<code dir=\"ltr\">2/3+3*(10-4)</code>, <code dir=\"ltr\">(1+x)/y^2</code>, <code dir=\"ltr\">2^0.5</code>, <code dir=\"ltr\">2^(1/3)</code>, <code dir=\"ltr\">2^n</code>, or <code dir=\"ltr\">sin(\\phi)</code>",
  rankDenotation: "rank",
  sections: {
    advices: "Advices",
    results: "Results",
    operationsWithMatrixA: "Operation with matrix A",
    operationsWithMatrixB: "Operation with matrix B"
  },
  sinDenotation: "sin",
  matrixRowDenotation: "<msub><mi>R</mi><mn>${i}</mn></msub>",
  rankDetails: {
    start: "Find the rank of matrix by <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Elementary_matrix#Elementary_row_operations\">elementary row operations</a>. The rank of the matrix is equal to the number of nonzero rows in the matrix after reducing it to <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Row_echelon_form\">the row echelon form</a> using elementary transformations over the rows of the matrix."
  },
  determinantDetails: {
    start: "Convert the matrix into the <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Row_echelon_form\">row echelon form</a>. Addition operation to one of the rows of another one multiplied by some number does not change <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Determinant\">the determinant</a>. The determinant of the transformed matrix is equal to the determinant of the original one."
  },
  inverseDetails: {
    start: "Find the inverse matrix using <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Invertible_matrix\">elementary transformations</a>, to do this <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Gaussian_elimination\">augment</a> the identity matrix of the same size to the right:"
  },
  eliminationDetails: {
    pivotElement: "Pivot element:",
    rowAddition: "Add to row ${i} row ${j}:",
    rowSwapNegate: "Swap row ${i} and row ${j}, multiplying row ${i} by ${-1}:",
    rowSwap: "Swap row ${i} and ${j}:",
    rowDivision: "Divide row ${j} by ${a}:",
    rowSubtraction: "Subtract ${a} &times; row ${i} from row ${j}:"
  },
  use: "Use",
  examples2: "Examples",
  methodOfMontanteDetails: {
    determinantDetails: {
      header: "Calculation of matrix determinant by <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Bareiss_algorithm\">Bareiss algorithm</a>",
      start: "The determinant of the matrix is equal to the element in the last line after reducing the matrix to the row echelon form using the formula ${a_(i,j)=(a_(r,c)*a_(i,j)-a_(i,c)*a_(r,j))/p}, where ${r} and ${c} - the numbers of the row and the column of support element, and ${p} - the value of the support element in the previous step. Note: ${someDetails3}."
    }
  },
  pleaseFillOutThisField: "Please fill out this field.",
  zeroRowColumn: "If in a matrix, any row or column is 0, then the determinant of that particular matrix is 0 (<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Determinant#Properties_of_the_determinant\">Properties of the determinant</a>).",
  hideAds: "Hide Ads",
  showAds: "Show Ads",
  Let: "Let",
  matrixDiagonalizationLink: "<a rel=\"noopener\" href=\"https://www.youtube.com/watch?v=Sf91gDhVZWU\">(?)</a>",
  matrixIsNotReal: "The matrix is not real",
  operationIsNotSupported: "This operation is not supported with the specified arguments.",
  roots: "Roots:",
  showLaTeX: "Show LaTeX",
  solveCubicEquationLink: "<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Cubic_function#General_formula\">(?)</a>",
  solvePalindromicEquaionLink: "<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Reciprocal_polynomial#Palindromic_and_antipalindromic_polynomials\">(?)</a>",
  solveQuadraticEquationLink: "<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Factorization#Using_formulas_for_polynomial_roots\">(?)</a>",
  solveTheCharacteristicEquationForEigenvaluesAndTheirAlgebraicMultiplicities: "Solve the characteristic equation for eigenvalues and their algebraic multiplicities:",
  sorryCannotWork: "Sorry, the calculator cannot work with such expressions",
  source: {
    sourceTitle: "Matrix calculator: source code",
    sourceDescription: "Source code of operation with matrices in Java and Delphi",
    introduction: "Here you can find a source code of a simple mobile calculator (Java ME) and a simple calculator on Delphi.",
    rosettacodeLink: "See <a href=\"https://rosettacode.org/wiki/Category:Matrices\">https://rosettacode.org/wiki/Category:Matrices</a> for a code related to matrix inverse, determinant, rank calculation.",
    content: "Contents:",
    javaME: "Source code of a mobile calculator on Java ME",
    download: "full program",
    delphi: "Source code of a calculator on Delphi"
  },
  systemOfEquations: "System of equations",
  theDiagonalMatrixTheDiagonalEntriesAreTheEigenvalues: "The diagonal matrix (the diagonal entries are the eigenvalues - ${eigenvaluesLinks}):",
  theJordanChainsMakeBasis: "The Jordan chains of generalized eigenvectors ${links} make a linearly independent set of vectors for the eigenvalue.",
  theMatrixIsInRowEchelonForm: "The matrix is in <a href=\"https://en.wikipedia.org/wiki/Row_echelon_form\"><a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Row_echelon_form\">row-echelon form</a></a>.",
  theMatrixIsNotPositiveDefinite: "The matrix is not positive definite",
  theMatrixIsNotSymmetric: "The matrix is not symmetric",
  theMatrixIsSymmetric: "The matrix is symmetric",
  theMatrixWithTheEigenvectorsAsItsColumns: "The <a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Modal_matrix\">matrix with the eigenvectors</a> (${eigenvectorsLinks}) as its columns:",
  then: "Then",
  toSolveSystemByInverseMatrixMethodNumberOfEquationsShouldBeEqualNumberOfVariables: "To solve the system by <a rel=\"noopener\" href=\"https://www.mathportal.org/algebra/solving-system-of-linear-equations/inverse-matrix-method.php\">Inverse Matrix Method</a> it must have the same number of equations as variables.",
  tryToFindJordanNormalForm: "Try to *find a Jordan normal form*.",
  unexpectedEndOfInput: "Error: unexpected end of input",
  unexpectedEndOfInputYExpected: "Error: unexpected end of input, ${y} expected",
  unexpectedX: "Error: unexpected ${x}",
  unexpectedXYExpected: "Error: unexpected ${x}, ${y} expected",
  useFormulaOfLeibniz: "Use Leibniz formula",
  useTheRationalRootTestLink: "<a rel=\"noopener\" href=\"https://en.wikipedia.org/wiki/Rational_root_theorem#Examples\">(?)</a>"
};