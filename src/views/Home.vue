<script setup>
import { onMounted, ref } from "vue";
import { connectDatabase } from "../lib/db.js";
import { DonutTypes } from "donutsql";

const results = ref([]);
const error = ref(null);
/*
    Theres the use of query function with parameters and 
    Without parameters.
*/

// Without parameters
async function getStudents() {
  try {
    const pool = await connectDatabase(); //  connect to database
    const result = await pool.query("SELECT * FROM student"); // You can call the query function without any parameter like this
    // ex:- query('your query')
    results.value = result.result.recordset;
  } catch (err) {
    console.log("QUERY ERROR...", err);
    error.value = err.message;
  }
}

// insertStudent() and deleteStudent(id) functions are for examples of query function with parameters
async function insertStudent() {
  try {
    const pool = await connectDatabase();
    // Here, I have used three parameters: param1, param2, and param3.
    await pool.query(
      "INSERT INTO student(name, age, address) VALUES (@param1, @param2, @param3)",
      {
        param1: {
          type: DonutTypes.Int(),
          value: document.getElementById("age").value,
        },
        param2: {
          type: DonutTypes.VarChar(),
          value: document.getElementById("name").value,
        },
        param3: {
          type: DonutTypes.Text(),
          value: document.getElementById("address").value || "No home",
        },
      },
    );
    /* 
        1. When using parameters, you mainly need to provide two properties: 
            the type and the value. 
        
            To define the data type of a parameter, you must import the 
            DonutTypes class and then use the appropriate type function. 
        
            Examples: 
                DonutTypes.Int() 
                DonutTypes.NvarChar() 
        
        2. Make sure you use the same name for the property name as the 
            parameter name when defining its type and value. 
        
            For example, if you use "param1" as the parameter name,
            the property name must also be "param1". 
    */

    await getStudents();
    alert("INSERTED...");
  } catch (err) {
    console.log("INSERT ERROR...", err);
    error.value = err.message;
  }
}

async function deleteStudent(id) {
  try {
    const pool = await connectDatabase();
    await pool.query("DELETE FROM student WHERE id = @sid", {
      sid: {
        type: DonutTypes.Int(),
        value: id,
      },
    });
    await getStudents();
    alert("DELETED!");
  } catch (err) {
    console.log("DELETE ERROR...", err);
    error.value = err.message;
  }
}

onMounted(() => {
  getStudents();
});
</script>

<template>
  <h1>DonutSQL - Vue.js Example</h1>
  <nav>
    <RouterLink to="/transaction" style="font-size: 20px; color: black"
      >Transaction Example</RouterLink
    >
    <RouterLink to="/procedure" style="font-size: 20px; color: black"
      >Procedure Example</RouterLink
    >
  </nav>
  <p v-if="error" id="error">{{ error }}</p>
  <div v-else id="tableInteraction">
    <table>
      <thead>
        <tr class="tableRows">
          <th>id</th>
          <th>name</th>
          <th>age</th>
          <th>address</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="res in results"
          :key="res.id"
          class="tableRows"
          v-on:click="deleteStudent(res.id)"
        >
          <td>{{ res.id }}</td>
          <td>{{ res.name }}</td>
          <td>{{ res.age }}</td>
          <td>{{ res.address }}</td>
        </tr>
      </tbody>
    </table>

    <form class="formClass">
      <p>Insert Student</p>
      <input type="text" placeholder="Name" id="name" required />
      <input type="text" placeholder="Age" id="age" required />
      <input type="text" placeholder="Address" id="address" />
      <button type="button" v-on:click="insertStudent">Insert</button>
    </form>
  </div>
</template>

<style scoped>
nav {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 10px;
}
#error {
  color: red;
}

#tableInteraction {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 10px;
}

table {
  border-collapse: collapse;
}

.tableRows th,
.tableRows td {
  width: 200px;
  padding: 8px;
  border: 1px solid black;
}

.tableRows:hover {
  background-color: #00000011;
  cursor: pointer;
}

/* 
  --------- form styiling -------
*/

.formClass {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid black;
  padding: 10px;
}
.formClass input {
  border: 1px solid black;
  color: black;
  background-color: white;
  height: 30px;
}
.formClass button {
  background-color: green;
  color: black;
  cursor: pointer;
  height: 30px;
}
</style>
