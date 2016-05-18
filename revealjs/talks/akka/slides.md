# Akka, actors and the right tool for the job
[@gamsd](https://twitter.com/gamsd) - [blog.gamsd.com](http://blog.gamsd.com)

---

We need to download files

---

<section data-background="images/simple.PNG">
</section>

---

15k clients

---

<section data-background="images/queue.PNG">
</section>

---

15k clients, infinite files

---

<section data-background="images/threads.PNG">
</section>

---

Mostly sorted

---

<section data-background="images/sorted.PNG">
</section>

---

DDOS

--

Smaller servers crash

--

Bigger servers block

--

No downloads for you

---

Limit requests for each domain

---

```
if (domainRequests < maxRequests) process()
else wat()
```

---

State, concurrency, locks :-(

---

Routing!

---

<section data-background="images/split.PNG">
</section>

---

How to control routing across multiple machines?

---

We may have more red messages than yellow.

How do we balance this?

How do we handle failures?

---

This is no longer about files!

---

Distribution

---

Distributed systems

---

What we need?

- Messaging
- Isolation
- Coordination across machines
- Concurrency

---

Actor model

- Messaging
- Isolation
- Clustering
- This is a concurrency model!

---

> In general terms, a method of computation that involves entities that send messages to each other

---

Actors communicate only through messages

No method calls

---

Each actor has a mailbox

Messages processed one at a time

---

State is internal to each actor

Changes based on messages, but under actor control

---

Actors are location transparent

---

Actor can create other actors

Hierarchies, supervision

---

Akka

---

Actor model for the JVM

--

Scala and Java

--

akka.io

---

My first actor

---

```
case class Download(url: String)
class DomainDownloader extends Actor {
  def receive = {
    case Download(url) => //do stuff
  }
}
```

---

Sending messages

---

```
val url = "http://photoeverywhere.co.uk/west/iceland/15-33isafhouses.jpg"
downloader ! Download(url)
```

---

One actor is no actor!

Actor systems

---

```
val system = ActorSystem("Main")
val downloader = system.actorOf(
  props = Props(classOf[DownloaderActor]),
  name = "downloader"
)
```

---

Supervision

---

```
override val supervisorStrategy = OneForOneStrategy() {
  case _: FailedDownloadException => Resume
  case otherwise => Escalate
}
```

---

We already have an actor system, we can send messages and there's some supervision in place

---

We still need to distribute the work

---

Routing

---

```
val router = {
  val routees = Vector.fill(5) {
    val r = context.actorOf(Props[DomainDownloader])
    ActorRefRoutee(r)
  }
  Router(RoundRobinRoutingLogic(), routees)
}
router.route(Download(url), sender())
```

---

Router actor

---

```
val otherRouter = context.actorOf(
  RoundRobinPool(
    nrOfInstances = 5,
    supervisorStrategy = supervisorStrategy
  ).props(Props[DomainDownloader]),
  name = "Router"
)
otherRouter ! Download(url)
```

---

Consistent hashing router actor

---

```
case class Download(url: String) extends ConsistentHashable {
  override def consistentHashKey = {
    val domain = parse(url, UriConfig.conservative).host.getOrElse("UNKNOWN")
    Hasher.md5(domain)
  }
}
```

--

```
val consistentRouter = context.actorOf(
  ConsistentHashingPool(
    nrOfInstances = 3
  ).props(Props[DomainDownloader]),
  name = "consistentRouter"
)
consistentRouter ! Download(url)
```

---

Balancing, Broadcast, ConsistentHashing, NoRoutee, Random, Resizable, RoundRobin, ScatterGatherFirstCompleted, Several, SmallestMailbox, TailChopping

---

Custom routing?

---

How many actors in a system? Lots!

--

1 actor aprox. 300B

---

How many machines in a system?

Clustering!

---

```
val clusterRouter = context.actorOf(
ClusterRouterPool(
  ConsistentHashingPool(5),
  ClusterRouterPoolSettings(
    totalInstances = 5,
    maxInstancesPerNode = 2,
    allowLocalRoutees = false,
    useRole = None)
).props(Props[DomainDownloader]),
name = "clusterRouter")
```

---

Clustering requires more configuration

---

```
akka {
  actor {
    provider = "akka.cluster.ClusterActorRefProvider"
  }
  remote {
    log-remote-lifecycle-events = off
    netty.tcp {
      hostname = "192.168.1.255"
      port = 2551
    }
  }
  cluster {
    seed-nodes = ["akka.tcp://Main@192.168.1.255:2551"]
    min-nr-of-members = 3
  }
}
```

---

And still...

```
downloader ! Download(url)
```

---

Enough!

This is just motivation, you'll need to reach out to learn more

---

Once your application is ready
- Akka HTTP
- Akka Streams
- Camel
- Other?

---

You still need to worry about
- Thread pools
- Monitoring
- Tuning
- Backpressure
- Overflows

---

The right tool for the job makes things easier

---

But then you need to know different tools to choose from!

---

# Akka, actors and the right tool for the job
[@gamsd](https://twitter.com/gamsd) - [blog.gamsd.com](http://blog.gamsd.com)
