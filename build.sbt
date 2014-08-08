import play.PlayImport._

name := """vulgar-bbs"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.1"

resolvers += Resolver.url("Objectify Play Repository", url("http://deadbolt.ws/releases/"))(Resolver.ivyStylePatterns)

libraryDependencies ++= Seq(
	jdbc, cache, ws, filters,
	"com.typesafe.slick" %% "slick" % "2.1.0-RC3",
	"com.typesafe.play" %% "play-slick" % "0.8.0-RC3",
	"net.sf.uadetector" % "uadetector-resources" % "2014.04",
  "org.webjars" % "jquery" % "2.1.1",
	"org.webjars" % "bootstrap" % "3.2.0",
	"org.webjars" % "font-awesome" % "4.1.0",
	"org.webjars" % "react" % "0.11.1",
	"org.webjars" % "underscorejs" % "1.6.0-3",
	"org.webjars" % "backbonejs" % "1.1.2-2",
	"org.webjars" % "ace" % "01.08.2014",
	"org.webjars" % "marked" % "0.3.2-1",
	"org.webjars" % "modernizr" % "2.7.1"
)

includeFilter in(Assets, LessKeys.less) := "main.less"
