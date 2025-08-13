import { MetadataRoute } from 'next'
import { createServerClient } from '@/lib/ServerClient'
import { gql } from '@apollo/client'

interface ArticleForSitemap {
  slug: string
  createdAt: string
  updatedAt?: string
  author: {
    username: string
  }
}

const GET_ARTICLES_FOR_SITEMAP = gql`
  query GetArticlesForSitemap {
    articles {
      slug
      createdAt
      updatedAt
      author {
        username
      }
    }
  }
`

async function getArticlesForSitemap(): Promise<ArticleForSitemap[]> {
  try {
    const { data } = await createServerClient().query({
      query: GET_ARTICLES_FOR_SITEMAP,
      fetchPolicy: 'cache-first',
    })
    
    return data?.articles || []
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: 'https://infobite.online',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://infobite.online/signup',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://infobite.online/signin',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  // Fetch articles and generate dynamic pages
  const articles = await getArticlesForSitemap()
  
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `https://infobite.online/user/${article.author.username}/article/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Combine static and dynamic pages
  return [...staticPages, ...articlePages]
}
