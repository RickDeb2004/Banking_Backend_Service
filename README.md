# Assignment



### 1./register 
   -Add a new customer to the customer table with approved limit 
    based on salary
![register](https://github.com/RickDeb2004/backend_alemeno/assets/113274631/96a6084f-c7af-46c7-bc82-f8bf7d3fd062)


### 2. /check-eligibility 
  -Check loan eligibility based on credit score of customers (out 
of 100) based on the historical loan data from “loan_data.xlsx”

![check_eligibility](https://github.com/RickDeb2004/backend_alemeno/assets/113274631/d6b76494-583f-4bda-89a9-87bbf7247725)



### 3. /create-loan 
  -Process a new loan based on eligibility

![create-loan](https://github.com/RickDeb2004/backend_alemeno/assets/113274631/7a6f85f0-5a15-4e21-aa05-5104895535e5)


### 4. /view-loan/loan_id 
   -View loan details and customer details

![view_loan](https://github.com/RickDeb2004/backend_alemeno/assets/113274631/62d449d8-4268-4dd5-95ad-38b363c3636c)


### 5. /make-payment/customer_id/loan_id 
▪ Make a payment towards an EMI
▪ EMI amount should be recalculated if the Amount being 
paid by the User is less/more than the due installment 
amount.
▪ Appropriate error handling should be done

![make-payment](https://github.com/RickDeb2004/backend_alemeno/assets/113274631/aa52a4ab-9a7a-433f-8724-3f6a04d065de)


### 6. /view-statement/customer_id/loan_id 
▪ View statement of a particular loan taken by the 
customer.
▪ Appropriate error handling should be done.
▪ Response Body (list of loan items, each loan item will 
have the following body) 

![view_statement](https://github.com/RickDeb2004/backend_alemeno/assets/113274631/c91d226b-aecf-4559-9f89-efd5bfebffe9)


##**MYSQL WORKBENCH CONFIG**

![image](https://github.com/RickDeb2004/backend_alemeno/assets/113274631/1cd29e58-039b-4eb3-a227-124646332ad7)




## Technologies Used


- **Backend**: Node.js, Express.js
- **Database**: MySQL
  
- **Containerization**: Docker
- **Deployment**: Docker Compose

## Getting Started

### Prerequisites

- Node.js installed on your machine
- MySQL server installed and running
- Docker and Docker Compose installed (for containerization)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd credit-approval-system
docker-compose up --build
```

## If docker not working 
```bash
npm install
npm start
```
