package io.rampant.vulgar.security

import models.User
import play.api.mvc.{WrappedRequest, Request}

case class AuthRequest[A](user: Option[User], request: Request[A]) extends WrappedRequest[A](request)
