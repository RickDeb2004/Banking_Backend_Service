// src/routes/loanRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../utils/database");
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM abc.pqr");
    res.status(200).send(result[0]); // Assuming result[0] contains the data
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});
router.post("/create-loan", async (req, res) => {
  try {
    const { customer_id, loan_amount, interest_rate, tenure } = req.body;

    const [customerRows] = await db.query(
      "SELECT * FROM customers.customer_data2 WHERE `Customer ID` = ?",
      [customer_id]
    );
    const customer = customerRows[0];
    if (!customer) {
      return res.status(400).json({ error: "Customer not found" });
    }

    const [loanResult] = await db.query(
      "INSERT INTO loans.loan_data2 (`Customer ID`, `Loan Amount`, `Interest Rate`, `Tenure`) VALUES (?, ?, ?, ?)",
      [customer_id, loan_amount, interest_rate, tenure]
    );
    const loan_id = loanResult.insertId;
    const loan = { loan_id, customer_id, loan_amount, interest_rate, tenure };

    res.json(loan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

function calculateMonthlyInstallment(loanAmount, interestRate, tenureMonths) {
  const monthlyInterestRate = interestRate / 100 / 12;

  const denominator = Math.pow(1 + monthlyInterestRate, tenureMonths) - 1;
  const monthlyPayment = (loanAmount * monthlyInterestRate) / denominator;

  return Math.round(monthlyPayment * 100) / 100;
}

router.get("/view-loan/:loan_id", async (req, res) => {
  try {
    const { loan_id } = req.params;

    const [loanRows] = await db.query(
      "SELECT * FROM loans.loan_data2 WHERE `Loan ID` = ?",
      [loan_id]
    );

    if (!loanRows || loanRows.length === 0) {
      return res.status(404).json({ error: "Loan not found" });
    }

    const loan = loanRows[0];

    const monthly_installment = calculateMonthlyInstallment(
      loan["Loan Amount"],
      loan["Interest Rate"],
      loan["Tenure"]
    );

    const customerDetails = {
      id: loan["Customer ID"],
      first_name: loan["First Name"],
      last_name: loan["Last Name"],
      phone_number: loan["Phone Number"],
      age: loan["Age"],
    };

    const responseBody = {
      loan_id: loan_id,
      customer: customerDetails,
      loan_amount: loan["Loan Amount"],
      interest_rate: loan["Interest Rate"],
      monthly_installment: monthly_installment,
      tenure: loan["Tenure"],
    };

    res.json(responseBody);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/make-payment/:customer_id/:loan_id", async (req, res) => {
  try {
    const { customer_id, loan_id } = req.params;
    const { amount } = req.body;

    const [loanRows] = await db.query(
      "SELECT * FROM loans.loan_data2 WHERE `Loan ID` = ? AND `Customer ID` = ?",
      [loan_id, customer_id]
    );

    if (!loanRows || loanRows.length === 0) {
      return res.status(404).json({ error: "Loan not found for the customer" });
    }

    const loan = loanRows[0];

    const remainingTenure = loan.tenure - loan["EMIs paid on Time"];
    const monthly_installment = calculateMonthlyInstallment(
      loan.loan_amount,
      loan.interest_rate,
      remainingTenure
    );

    const totalAmountDue = monthly_installment * remainingTenure;

    if (amount < monthly_installment) {
      return res.status(400).json({
        error: "Payment amount cannot be less than the monthly installment",
      });
    }

    const remainingAmountDue = totalAmountDue - amount;

    if (remainingAmountDue < 0) {
      return res
        .status(400)
        .json({ error: "Payment amount exceeds the total amount due" });
    }

    const responseBody = {
      message: "Payment successful",
      remaining_amount_due: remainingAmountDue,
    };

    res.json(responseBody);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/view-statement/:customer_id/:loan_id", async (req, res) => {
  try {
    const { customer_id, loan_id } = req.params;

    const [loanRows] = await db.query(
      "SELECT * FROM loans.loan_data2 WHERE `Customer ID` = ? AND `Loan ID` = ?",
      [customer_id, loan_id]
    );

    if (!loanRows || loanRows.length === 0) {
      return res.status(404).json({ error: "Loan not found" });
    }

    const loan = loanRows[0];

    const repayments_left = loan["Tenure"] - loan["EMIs paid on Time"];

    const responseBody = {
      customer_id: loan["Customer ID"],
      loan_id: loan["Loan ID"],
      principal: loan["Loan Amount"],
      interest_rate: loan["Interest Rate"],
      amount_paid: loan["Amount Paid"],
      monthly_installment: loan["Monthly Installment"],
      repayments_left: repayments_left,
    };

    // Send response
    res.json(responseBody);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
