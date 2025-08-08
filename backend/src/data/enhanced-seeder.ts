import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { QuestionModel } from '../models/question.model';

dotenv.config();

const categories = [
  'Frontend',
  'Backend', 
  'Data Structures',
  'Algorithms',
  'System Design',
  'Databases',
  'DevOps',
  'Testing',
  'Cloud',
  'AI/ML',
  'Mobile'
];

const questionsByCategory = {
  'Frontend': [
    {
      question: "Explain the differences between React 18 and previous versions",
      answer: "React 18 introduces several key improvements: 1) Automatic batching for better performance, 2) New concurrent features like startTransition for non-urgent state updates, 3) Improved Suspense for better loading states, 4) New root API with createRoot for concurrent rendering, 5) Improved server-side rendering with streaming HTML and selective hydration.",
      tags: ["React", "React 18", "Frontend"]
    },
    {
      question: "What is Server Components in Next.js/React and how do they work?",
      answer: "Server Components allow components to be rendered on the server, reducing bundle size and improving performance. Key benefits: 1) Zero client-side JavaScript, 2) Automatic code splitting, 3) Direct access to server-side data sources, 4) Better caching. They're different from Server-Side Rendering (SSR) as they don't send JavaScript to the client at all.",
      tags: ["React", "Next.js", "Server Components", "Performance"]
    },
    {
      question: "Compare React's new useTransition vs useDeferredValue hooks",
      answer: "Both help with performance but serve different purposes: useTransition marks state updates as non-urgent, allowing UI to stay responsive. useDeferredValue defers updates to non-urgent parts of the screen. Use useTransition when you control the state update, use useDeferredValue when you receive a prop that might cause expensive re-renders.",
      tags: ["React", "Hooks", "Performance"]
    },
    {
      question: "What are Angular Signals and how do they improve change detection?",
      answer: "Angular Signals (introduced in Angular 16) are a new reactive primitive that provide granular tracking of state changes. They enable fine-grained reactivity by only updating components that depend on changed signals, as opposed to Angular's traditional zone.js-based change detection which checks the entire component tree.",
      tags: ["Angular", "Signals", "Change Detection"]
    },
    {
      question: "Explain the benefits of using TypeScript with React and best practices",
      answer: "Benefits: 1) Better developer experience with autocompletion, 2) Early error detection, 3) Self-documenting code. Best practices: Use TypeScript interfaces for props and state, leverage utility types (Partial, Pick, Omit), use strict mode, define custom hooks with proper typing, and use generics for reusable components.",
      tags: ["TypeScript", "React", "Best Practices"]
    }
  ],
  'Backend': [
    {
      question: "Compare REST, GraphQL, and gRPC for API design in 2024",
      answer: "REST: Best for simple CRUD operations, uses HTTP methods, easy to cache, but can lead to over/under-fetching. GraphQL: Query language for APIs, client requests exactly what it needs, single endpoint, but can be complex to implement caching. gRPC: High-performance RPC framework, uses Protocol Buffers, great for microservices, supports bidirectional streaming, but has steeper learning curve and less browser support. In 2024, consider: use REST for public APIs, GraphQL for complex client needs, gRPC for internal microservices.",
      tags: ["REST", "GraphQL", "gRPC", "API Design"]
    },
    {
      question: "What are the best practices for building scalable microservices in 2024?",
      answer: "1) Domain-Driven Design for service boundaries, 2) Event-driven architecture with message brokers (Kafka, RabbitMQ), 3) Container orchestration with Kubernetes, 4) Service mesh for observability (Istio, Linkerd), 5) Distributed tracing (Jaeger, Zipkin), 6) Circuit breakers and retry patterns, 7) API gateways for request routing, 8) Polyglot persistence, 9) Chaos engineering practices, 10) GitOps for deployment automation.",
      tags: ["Microservices", "Scalability", "Best Practices"]
    },
    {
      question: "Explain JWT authentication and security best practices",
      answer: "JWT (JSON Web Tokens) are compact, URL-safe tokens for authentication. Structure: Header (algorithm, token type), Payload (claims), and Signature. Security best practices: 1) Use HTTPS, 2) Set short expiration times, 3) Implement token refresh mechanism, 4) Store tokens in HTTP-only cookies, 5) Use strong signing algorithms (RS256), 6) Implement token blacklisting, 7) Validate all token claims, 8) Protect against CSRF with SameSite cookies, 9) Rotate encryption keys regularly, 10) Use appropriate token size.",
      tags: ["Authentication", "JWT", "Security"]
    },
    {
      question: "What are the key differences between Node.js and Deno?",
      answer: "Deno is a modern runtime for JavaScript/TypeScript created by Node.js' original creator. Key differences: 1) Built-in TypeScript support, 2) Secure by default (explicit permissions), 3) No package.json or node_modules, 4) ES modules by default, 5) Built-in testing and formatting, 6) Web standard APIs (fetch, WebSockets), 7) Single executable, 8) Top-level await. Node.js has better ecosystem support and is more mature for production use.",
      tags: ["Node.js", "Deno", "JavaScript", "Runtime"]
    },
    {
      question: "Explain the differences between WebSockets, Server-Sent Events (SSE), and HTTP/2 Server Push",
      answer: "WebSockets: Full-duplex communication, ideal for real-time bidirectional data (chat, gaming). SSE: Server-to-client push only, simpler than WebSockets, works over HTTP. HTTP/2 Server Push: Server proactively pushes resources to client cache before they're requested. Choose WebSockets for bidirectional real-time, SSE for server push notifications, HTTP/2 Push for optimizing page load performance.",
      tags: ["WebSockets", "SSE", "HTTP/2", "Real-time"]
    },
    {
      question: "What is the difference between authentication and authorization?",
      answer: "Authentication is the process of verifying who someone is, while authorization is the process of verifying what specific resources a user has access to. Authentication usually involves credentials like username/password, while authorization involves permissions and roles.",
      tags: ["Authentication", "Authorization", "Security"]
    },
    {
      question: "What is JWT and how does it work?",
      answer: "JWT (JSON Web Token) is a compact, URL-safe means of representing claims to be transferred between two parties. It consists of three parts: header (algorithm and token type), payload (claims), and signature. JWTs are commonly used for authentication and information exchange.",
      tags: ["JWT", "Authentication", "Security"]
    },
    {
      question: "What is the difference between SOAP and REST?",
      answer: "SOAP is a protocol with strict standards, while REST is an architectural style. SOAP uses XML exclusively, while REST can use multiple formats (JSON, XML, etc.). SOAP has built-in error handling, while REST uses HTTP status codes. SOAP is generally more verbose than REST.",
      tags: ["SOAP", "REST", "API"]
    },
    {
      question: "What is the difference between microservices and monolithic architecture?",
      answer: "Monolithic architecture is a single, unified application where all components are interconnected, while microservices architecture is a collection of small, independent services. Microservices offer better scalability and fault isolation but add complexity in terms of deployment and inter-service communication.",
      tags: ["Microservices", "Architecture", "Scalability"]
    }
  ],
  'Data Structures': [
    {
      question: "Explain the differences between arrays, ArrayLists, and LinkedLists in terms of time complexity",
      answer: "1) Arrays: O(1) access by index, O(n) insertion/deletion (shifting required), fixed size. 2) ArrayLists: Dynamic array, O(1) amortized access, O(n) insertion/deletion (worst case), good for read-heavy operations. 3) LinkedLists: O(1) insertion/deletion at head/tail, O(n) access by index, uses more memory due to node overhead. Modern systems often prefer ArrayLists due to better cache locality, unless frequent insertions/deletions in the middle are required.",
      tags: ["Array", "ArrayList", "LinkedList", "Time Complexity"]
    },
    {
      question: "How would you implement and when would you use a Bloom filter?",
      answer: "A Bloom filter is a space-efficient probabilistic data structure that tells you if an element is possibly in the set or definitely not in the set (no false negatives, possible false positives). Implementation: 1) Bit array of m bits, 2) k different hash functions. Use cases: 1) Cache filtering, 2) Preventing 'one-hit wonders' in web caches, 3) Database query optimization, 4) Network routers. Not suitable when you need the actual data or can't tolerate false positives.",
      tags: ["Bloom Filter", "Probabilistic Data Structure", "Algorithms"]
    },
    {
      question: "Compare and contrast hash tables and tries for string storage",
      answer: "Hash Tables: O(1) average case lookup/insert/delete, no ordering, can have collisions, good for exact matches. Tries: O(m) operations where m is key length, maintains order, no collisions, good for prefix searches and autocomplete. Memory usage: Tries can be more space-efficient for similar keys. In 2024, modern systems often use optimized tries like Radix trees or Cuckoo hashing for specific use cases.",
      tags: ["Hash Table", "Trie", "Data Structures"]
    },
    {
      question: "What are the differences between B-trees and LSM trees in database indexing?",
      answer: "B-trees: In-memory + on-disk structure, good for read-heavy workloads, balanced tree structure, writes can be expensive due to rebalancing. LSM-trees: Write-optimized, uses memtables and SSTables, better for write-heavy workloads, requires compaction, can have higher read amplification. Modern databases often use variants: B+ trees for traditional RDBMS, RocksDB/Cassandra use LSM trees.",
      tags: ["B-tree", "LSM Tree", "Database", "Indexing"]
    },
    {
      question: "How would you design an efficient autocomplete system?",
      answer: "1) Data Structure: Use a Trie (prefix tree) for efficient prefix searches, 2) Store top k most frequent completions at each node, 3) Use a hash map for quick access to frequency counts, 4) Implement a distributed cache (Redis) for popular queries, 5) Use n-gram language models for better suggestions, 6) Implement client-side caching of recent searches, 7) Consider using a specialized search engine like Elasticsearch for large-scale systems, 8) Add personalization based on user history.",
      tags: ["Autocomplete", "Trie", "System Design"]
    },
    {
      question: "What is a hash table and how does it work?",
      answer: "A hash table is a data structure that implements an associative array using a hash function to map keys to values. It provides O(1) average time complexity for search, insert, and delete operations. Collisions can be handled using chaining (linked lists) or open addressing (probing).",
      tags: ["Hash Table", "Data Structures", "Algorithms"]
    },
    {
      question: "What is the difference between a stack and a queue?",
      answer: "A stack is a LIFO (Last In, First Out) data structure where elements are added and removed from the same end. A queue is a FIFO (First In, First Out) data structure where elements are added at the rear and removed from the front. Both can be implemented using arrays or linked lists.",
      tags: ["Stack", "Queue", "Data Structures"]
    },
    {
      question: "What is a binary search tree and what are its properties?",
      answer: "A binary search tree is a node-based binary tree where each node has at most two children. Properties: 1) Left subtree of a node contains only nodes with keys less than the node's key. 2) Right subtree of a node contains only nodes with keys greater than the node's key. 3) Both left and right subtrees must also be binary search trees.",
      tags: ["Binary Search Tree", "Data Structures", "Algorithms"]
    },
    {
      question: "What is a heap and what are its types?",
      answer: "A heap is a specialized tree-based data structure that satisfies the heap property. In a max heap, for any given node, the value of the node is greater than or equal to the values of its children. In a min heap, the value is less than or equal to its children. Heaps are commonly used to implement priority queues.",
      tags: ["Heap", "Priority Queue", "Data Structures"]
    }
  ],
  'Algorithms': [
    {
      question: "What is the difference between BFS and DFS?",
      answer: "Breadth-First Search (BFS) explores all neighbors at the present depth before moving to nodes at the next depth level, using a queue. Depth-First Search (DFS) explores as far as possible along each branch before backtracking, using a stack. BFS is better for finding shortest paths, while DFS uses less memory.",
      tags: ["BFS", "DFS", "Graph Traversal"]
    },
    {
      question: "What is the time complexity of quicksort and what is its worst-case scenario?",
      answer: "Quicksort has an average time complexity of O(n log n) and a worst-case time complexity of O(n²). The worst case occurs when the pivot is consistently the smallest or largest element, leading to highly unbalanced partitions. This can be mitigated by using a randomized pivot.",
      tags: ["Quicksort", "Sorting", "Time Complexity"]
    },
    {
      question: "What is dynamic programming?",
      answer: "Dynamic programming is a method for solving complex problems by breaking them down into simpler subproblems. It's used when the solution to a problem can be constructed from solutions to its subproblems. Key characteristics are overlapping subproblems and optimal substructure. It can be implemented using memoization (top-down) or tabulation (bottom-up).",
      tags: ["Dynamic Programming", "Algorithms", "Optimization"]
    },
    {
      question: "What is the difference between Dijkstra's and Bellman-Ford algorithms?",
      answer: "Both find shortest paths in a graph, but Dijkstra's only works with non-negative edge weights and is more efficient (O((V+E) log V) with a binary heap), while Bellman-Ford can handle negative weights and detect negative cycles but is less efficient (O(VE)).",
      tags: ["Dijkstra", "Bellman-Ford", "Graph Algorithms"]
    },
    {
      question: "What is the difference between memoization and tabulation?",
      answer: "Memoization is a top-down approach where you solve the main problem first and store solutions to subproblems. Tabulation is a bottom-up approach where you solve all subproblems first and build up to the main solution. Memoization uses recursion and is generally more intuitive, while tabulation is iterative and can be more space-efficient.",
      tags: ["Memoization", "Tabulation", "Dynamic Programming"]
    }
  ]
};

export const seedData = async (): Promise<boolean> => {
  try {
    // Don't connect to MongoDB here - it's already connected
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB connection not established');
    }

    // Clear existing data
    const deleteResult = await QuestionModel.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing questions`);

    // Insert new questions
    let questionCount = 0;
    for (const [category, questions] of Object.entries(questionsByCategory)) {
      const questionsWithCategory = questions.map(q => ({
        ...q,
        category,
        difficulty: getDifficulty(category, q.tags)
      }));
      
      const result = await QuestionModel.insertMany(questionsWithCategory);
      questionCount += result.length;
      console.log(`Added ${result.length} questions for ${category}`);
    }

    console.log(`\n✅ Successfully seeded ${questionCount} questions across ${Object.keys(questionsByCategory).length} categories`);
    return true;
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    if (err instanceof Error) {
      throw new Error(`Seeding failed: ${err.message}`);
    }
    throw new Error('Seeding failed with unknown error');
  }
};

// Helper function to assign difficulty based on category and tags
function getDifficulty(category: string, tags: string[]): string {
  const difficulties = ['Easy', 'Medium', 'Hard'];
  // Simple hash function to get consistent difficulty for same inputs
  const hash = (s: string) => s.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const seed = hash(category + tags.join(''));
  return difficulties[Math.abs(seed) % difficulties.length];
}

// Only run the seeder directly if this file is executed directly (not imported)
if (require.main === module) {
  import('dotenv/config').then(() => {
    mongoose.connect(process.env.MONGO_URI as string)
      .then(() => seedData())
      .then(() => process.exit(0))
      .catch(err => {
        console.error('❌ Error in seeder:', err);
        process.exit(1);
      });
  });
}
