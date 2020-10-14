<template>
 <v-container class="my-5">
     <h3 class="red--text">Herzlich willkommen zur unserem neuem Elternsprechtag-OnlineTool </h3><br>
     <p class="black--text">Diese Webseite wurde von den Schülern der Klasse ITA3a programmiert.
         Wenn Sie Fragen zur Software haben oder ein Problem melden möchten, können Sie eine Email an ITA3a-team@gmail.com an unser Team senden.</p>
     <h3>{{this.$store.getters.getLehrerBuchAdmin}}</h3>
     <h3>{{this.$store.getters.getLehrerAdmin}}</h3>
     <h3>{{this.$store.getters.getLehrer}}</h3>
     <h3>{{this.$store.getters.getSchueler}}</h3>
 
 </v-container>
</template>

<script>

export default {
  name: 'Home',
  components: {
  }
}
</script>

<style>
h1 {
  text-align: center;
  font-family: Arial;
}
h3 {
  text-align: center;
  font-family: Arial;
}
p{
  font-family: Arial;
}
</style>
