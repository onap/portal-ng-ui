.. This work is licensed under a Creative Commons Attribution 4.0 International License.
.. http://creativecommons.org/licenses/by/4.0
.. Copyright (C) 2024 Deutsche Telekom AG

.. DO NOT CHANGE THIS LABEL FOR RELEASE NOTES - EVEN THOUGH IT GIVES A WARNING
.. _release_notes:

Portal-NG Release Notes
#######################

.. contents::
    :depth: 2
..

..      ==========================
..      * * *   OSLO (0.1.4)   * * *
..      ==========================

Version: 0.1.4
==============

:Release Date: 2026-05-06

Portal-NG UI Release Image Versions
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

 - onap/portal-ng/ui **0.1.4**

**Changes**

*  add playwright e2e tests
*  add tests for user-administration
*  add tests for user creation
*  add app-starter tests
*  fix role assignment in user creation
*  fix e2e test github action
*  fix playwright command arg
*  adjust e2e test action
*  update deps
*  use release version of node-build-action
*  configure dependabot not to create PR's for major versions
*  chore: add dependabot config
*  bump node from 18-alpine to 25-alpine
*  CI: update all workflow action calls/locations needing updates
*  CI: update GitHub2Gerrit workflow
*  CI: deploy python based Github2Gerrit
*  CI: remove duplicate G2G workflow
*  Docs: replace blockdiag/seqdiag with Mermaid
*  fix: set basepython to python3.13 in docs/tox.ini
*  chore: remove broken sphinxcontrib-swaggerdoc module
*  chore: update RTD and tox config for ubuntu-24.04
*  bump various CI action and Angular dependency versions

**********

..      =========================
..      * * *   NEW DELHI   * * *
..      =========================

Version: 0.1.0
==============

Release Data
------------

+------------------------------+----------------------------------------------+
| **Portal-ng Project**        |                                              |
|                              |                                              |
+------------------------------+----------------------------------------------+
| **Docker images**            | onap/portal-ng/ui:0.1.1                      |
|                              | onap/portal-ng/bff:0.1.0                     |
|                              | onap/portal-ng/preferences:0.1.1             |
|                              | onap/portal-ng/history:0.1.1                 |
|                              |                                              |
+------------------------------+----------------------------------------------+
| **Release designation**      | 0.1.1 New Delhi                              |
|                              |                                              |
+------------------------------+----------------------------------------------+
| **Release date**             | 2024 June 13                                 |
|                              |                                              |
+------------------------------+----------------------------------------------+


Features
--------
The Portal-NG is the successor of the Portal project, which has been
discontinued. It offers a dashboard with the last user-actions in the portal,
an app-starter that references the other ui's available in ONAP and a user
management that allows creating and editing users and their roles.

.. _newdelhi_deliverable:

Deliverables
------------

Software Deliverables

.. csv-table::
   :header: "Repository", "SubModules", "Version & Docker Image (if applicable)"
   :widths: auto

   "portal-ng-ui", "", "onap/portal-ng/ui:0.1.1"
   "portal-ng-bff", "", "onap/portal-ng/bff:0.1.0"
   "portal-ng-preferences", "", "onap/portal-ng/preferences:0.1.1"
   "portal-ng-history", "", "onap/portal-ng/history:0.1.1"


Known Limitations, Issues and Workarounds
-----------------------------------------

    None

*System Limitations*

None

*Known Vulnerabilities*

None

*Workarounds*

Documented under corresponding jira if applicable.

Security Notes
--------------

*Fixed Security Issues*

    None

*Known Security Issues*

    None

*Known Vulnerabilities in Used Modules*

    None

References
----------

For more information on the latest ONAP release, please see:

#. `ONAP Home Page`_
#. `ONAP Wiki Page`_
#. `ONAP Documentation`_
#. `ONAP Release Downloads`_


.. _`ONAP Home Page`: https://www.onap.org
.. _`ONAP Wiki Page`: https://wiki.onap.org
.. _`ONAP Documentation`: https://docs.onap.org
.. _`ONAP Release Downloads`: https://git.onap.org
