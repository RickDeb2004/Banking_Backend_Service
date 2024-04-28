// src/routes/customerRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../utils/database");

router.post("/register", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      age,
      monthly_income,
      phone_number,
      current_debt,
    } = req.body;

    if (isNaN(monthly_income)) {
      return res
        .status(400)
        .json({ error: "Monthly income must be a valid number" });
    }
    const approved_limit = Math.round((36 * monthly_income) / 100000) * 100000; // rounded to nearest lakh

    const [result] = await db.query(
      "INSERT INTO customers.customer_data2 ( `First Name`, `Last Name`,  `Age`, `Phone Number`, `Monthly Salary`, `Approved Limit`, `Current Debt`)  VALUES (?, ?, ?, ?, ?, ?,?)",
      [
        first_name,
        last_name,
        age,
        monthly_income,
        approved_limit,
        phone_number,
        current_debt,
      ]
    );

    const customer_id = result.insertId;
    const customer = {
      customer_id,
      first_name,
      last_name,
      age,
      monthly_income,
      approved_limit,
      phone_number,
      current_debt,
    };

    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

function calculateCreditScore(customer, loanRows) {
  let creditScore = 100;

  const pastLoansPaidOnTime = calculatePastLoansPaidOnTime(loanRows);
  creditScore -= pastLoansPaidOnTime * 5;
  const numberOfLoansTaken = loanRows.length;
  creditScore -= numberOfLoansTaken * 3;

  const currentYear = new Date().getFullYear();
  const currentYearLoanActivity = calculateCurrentYearLoanActivity(
    loanRows,
    currentYear
  );
  creditScore -= currentYearLoanActivity * 2;

  const loanApprovedVolume = calculateLoanApprovedVolume(loanRows);
  if (loanApprovedVolume > customer["Approved Limit"]) {
    creditScore = 0;
  }

  return creditScore;
}

function calculateTotalEMI(loanRows) {
  let totalEMI = 0;
  for (const loan of loanRows) {
    totalEMI += loan["EMI"];
  }
  return totalEMI;
}

function calculatePastLoansPaidOnTime(loanRows) {
  let count = 0;
  for (const loan of loanRows) {
    if (loan["Paid On Time"]) {
      count++;
    }
  }
  return count;
}

function calculateCurrentYearLoanActivity(loanRows, currentYear) {
  let count = 0;
  for (const loan of loanRows) {
    const loanYear = new Date(loan["Loan Date"]).getFullYear();
    if (loanYear === currentYear) {
      count++;
    }
  }
  return count;
}

function calculateLoanApprovedVolume(loanRows) {
  let totalApprovedAmount = 0;
  for (const loan of loanRows) {
    totalApprovedAmount += loan["Approved Amount"];
  }
  return totalApprovedAmount;
}

router.post("/check-eligibility", async (req, res) => {
  try {
    const { customer_id } = req.body;

    const [customerRows] = await db.query(
      "SELECT * FROM customers.customer_data2 WHERE `Customer ID` = ?",
      [customer_id]
    );
    const customer = customerRows[0];

    const [loanRows] = await db.query(
      "SELECT * FROM loans.loan_data2 WHERE `Customer ID` = ?",
      [customer_id]
    );

    let creditScore = calculateCreditScore(customer, loanRows);

    let approval = false;
    let interestRate = 0;

    if (creditScore > 50) {
      approval = true;
    } else if (creditScore > 30) {
      approval = true;
      interestRate = 12;
    } else if (creditScore > 10) {
      approval = true;
      interestRate = 16;
    }

    const totalEMI = calculateTotalEMI(loanRows);
    if (totalEMI > 0.5 * customer["Monthly Salary"]) {
      approval = false;
    }

    if (approval && interestRate !== 0) {
      if (interestRate < 12) {
        interestRate = 12;
      } else if (interestRate > 16) {
        interestRate = 16;
      }
    }

    const responseBody = {
      customer_id,
      approval,
      credit_score: creditScore,
      interest_rate: interestRate,
    };

    res.json(responseBody);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
