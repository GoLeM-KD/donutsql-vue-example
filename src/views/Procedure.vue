<script setup>
import { connectDatabase } from "@/lib/db";
import { DonutTypes } from "donutsql";
import { ref } from "vue";
/*
    Theres the use of execute function with parameters and 
    Without parameters.
*/
const error = ref(null);
const executeResult = ref([]);

// Without paramters
async function executeWithoutParams() {
  try {
    const pool = await connectDatabase(); // connect the database
    /*
        Stored procedure script:
            CREATE PROCEDURE get_names_of_students_and_their_subjects
            AS
            BEGIN
                SET NOCOUNT ON;
                SELECT stud.name AS student_Name,
                        sub.name AS subject_Name
                FROM student AS stud
                INNER JOIN user_subject AS us
                ON us.studentID = stud.id
                INNER JOIN subject AS sub
                ON us.subjectID = sub.subjectID;
            END;
    */

    // You can execute a stored procedure using the execute function as shown below.
    const result = await pool.execute(
      "get_names_of_students_and_their_subjects",
    );
    // ex:- execute(procedure_name)
    executeResult.value = result.result.recordset;

    alert("SUCCESSFULLY EXECUTED!");
  } catch (err) {
    console.log("EXECUTE PROCEDURE WITHOUT PARAM...\n", err);
    error.value = err.message;
  }
}

// With parameters
async function executeWithParams() {
  try {
    const pool = await connectDatabase();

    /*
        stored procedure script:
            CREATE PROCEDURE insert_students_subjects
                @sid INT ,
                @subid INT 
            AS
            BEGIN
                SET NOCOUNT ON;
                INSERT INTO user_subject (studentID, subjectID) VALUES (@sid, @subid);
            END;
    */

    // Here, I have used two parameters named sid and subid.
    await pool.execute("insert_students_subjects", {
      sid: {
        type: DonutTypes.Int(),
        value: document.getElementById("studentID").value,
      },
      subid: {
        type: DonutTypes.Int(),
        value: document.getElementById("subjectID").value,
      },
    });
    /*
        1. When using parameters, you mainly need to provide two properties: 
            the type and the value. 
        
            To define the data type of a parameter, you must import the 
            DonutTypes class and then use the appropriate type function. 
        
            Examples: 
                DonutTypes.Int() 
                DonutTypes.NvarChar() 
        
        2. Make sure the property names match the parameter names in 
            the stored procedure and are defined in the correct order.

            Example: 
                The stored procedure above has two parameters: sid and subid, 
                in that order.
                
                The property names below use the same names as the stored
                procedure parameters and are defined in the same order.
    */
    alert("PRCEDURE EXECUTED SUCCESSFULLY!");
  } catch (err) {
    console.log("PROCEDURE WITH PARAMS ERROR...\n", err);
    error.value = err.message;
  }
}
</script>

<template>
  <p v-if="error" style="color: red">{{ error }}</p>
  <div>
    <p>Insert into user_subject through the procedure</p>
    <input
      type="text"
      placeholder="StudentID to insert into user_subject"
      id="studentID"
      required
    />
    <input
      type="text"
      placeholder="SubjectID to insert into user_subject"
      id="subjectID"
      required
    />
    <button type="button" v-on:click="executeWithParams">Execute</button>
  </div>

  <div style="margin-top: 10px">
    <button type="button" v-on:click="executeWithoutParams">
      Execute without params
    </button>

    <table v-if="executeResult.length > 0">
      <thead>
        <tr>
          <th v-for="column in Object.keys(executeResult[0])">{{ column }}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="res in executeResult">
          <td v-for="columnName in Object.keys(executeResult[0])">
            {{ res[columnName] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
template {
  display: flex;
  flex-wrap: wrap;
}
div {
  width: 500px;
  padding: 10px;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input {
  border: 1px solid black;
  color: black;
  background-color: white;
  padding: 8px;
}

button {
  background-color: green;
  color: white;
  cursor: pointer;
  padding: 8px;
}
table {
  border-collapse: collapse;
}
tr,
th,
td {
  border: 1px solid black;
  padding: 8px;
}
</style>
