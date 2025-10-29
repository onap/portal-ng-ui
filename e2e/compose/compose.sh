#!/bin/sh
#  Copyright (c) 2025. Deutsche Telekom AG
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#  http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
#
#  SPDX-License-Identifier: Apache-2.0

wait_for_keycloak() {
  url="http://localhost:9080/realms/ONAP/.well-known/openid-configuration"
  while true
  do
    status=$(wget --quiet --spider --server-response "$url" 2>&1 | awk '/^  HTTP\// {print $2}')
    if [ "$status" = "200" ]; then
      tput setaf 10;
      printf "`echo " ✔"` `tput sgr0 && echo "Keycloak ready to receive requests"`\n"
      break
    else
      sleep 1
    fi
  done
}

docker compose -f e2e/compose/docker-compose.yml up -d
wait_for_keycloak
