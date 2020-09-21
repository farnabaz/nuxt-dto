<template>
  <div>
    <form @submit.prevent="doSearch">
      <label>Search Github Repositories:</label>
      <input v-model="query" type="text">
      <button>Search</button>
    </form>
    <ul>
      <li v-for="repo in repositories" :key="repo.url">
        <a :href="repo.url">{{ repo.name }}</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'nuxt-class-component'

import SearchRepositories from '../models/SearchRepositories'
import Respository from '../models/Repository'

@Component({
  name: 'IndexPage',
  middleware: []
})
export default class extends Vue {
    query = 'nuxt'
    repositories: Respository[] = [];

    mounted () {
      this.doSearch()
    }

    async doSearch () {
      const result = await this.$http.fetch<SearchRepositories>(SearchRepositories, {
        params: {
          query: this.query,
          language: 'javascript'
        }
      })
      this.repositories = result.items
    }
}
</script>
