<script setup>
import { onMounted, ref } from "vue";
import { connectDatabase } from "../lib/db.js";
import { DonutTypes } from "donutsql";
/*
    Example for database transaction
*/
const error = ref(null);

async function doTransaction() {
  try {
    const pool = await connectDatabase(); // Connecting the database
    /*
        after connecting the database you can call transaction function
        and you can do multiple transactions as below.
    */
    await pool.transaction((tx) => {
      tx.query(`INSERT INTO student(name, age) VALUES (@name, @age)`, {
        age: {
          type: DonutTypes.Int(),
          value: document.getElementById("age").value,
        },
        name: {
          type: DonutTypes.NVarChar(),
          value: document.getElementById("name").value,
        },
      });

      tx.query(`INSERT INTO subject(name) VALUES (@sub)`, {
        sub: {
          type: DonutTypes.Text(),
          value: document.getElementById("subName").value,
        },
      });

      tx.query(`DELETE FROM subject WHERE subjectID = @param`, {
        param: {
          type: DonutTypes.Int(),
          value: document.getElementById("subId").value,
        },
      });
    });
    alert("TRANSACTION SUCCESSFUL!")
  } catch (err) {
    console.log("TRANSACTION ERROR...", err);
    error.value = err.message;
  }
}
</script>

<template>
  <p v-if="error">{{ error }}</p>

  <div class="mainDiv" v-else>
    <div>
      <p>Insert Student</p>
      <input type="text" placeholder="Student name" id="name" required />
      <input type="text" placeholder="student age" id="age" required />
    </div>

    <div>
      <p>Subject</p>
      <input
        type="text"
        placeholder="Subject Name to insert"
        id="subName"
        required
      />
      <input
        type="text"
        placeholder="Subject ID to delete"
        id="subId"
        required
      />
    </div>
    <button type="button" v-on:click="doTransaction">Do Transaction</button>
  </div>
</template>

<style scoped>
.mainDiv {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.mainDiv div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 20px;
  border: 1px solid black;
}
.mainDiv input {
  height: 30px;
}
.mainDiv button {
  padding: 10px;
  background-color: green;
  color: white;
  cursor: pointer;
}
</style>
