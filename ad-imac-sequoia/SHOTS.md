# Generated assets — Higgsfield job IDs

Media lives in the Higgsfield workspace (the session's egress policy blocks the
CloudFront media host, so nothing was pulled to disk here). Job IDs are stable —
re-open or re-roll any single shot without disturbing the rest.

## Keyframes — `gpt_image_2_5`, quality high, 2k, 16:9

| Role | Job ID |
|---|---|
| Casting / establishing two-shot | `9f81f3c0-811e-4358-9d78-98230f894fd0` |
| Tom alone, frustrated | `c70ad4ad-4e55-4827-bd6e-9ccf55c5e20d` |
| Over-the-shoulder, Ellie leaning in | `ccee5562-afff-42b6-a2f2-25ccab35c2b8` |
| Reaction, she leaves | `b88d0945-2d6e-4bfd-906e-69644bb36c52` |

The casting frame is the identity anchor — the other three were generated with it as
`image_references`, which is what keeps the faces, clothes and room consistent. Re-roll
any shot against the same anchor and the casting holds.

## Takes — `kling3_0`, mode pro, sound on, 16:9

| # | Dur | Job ID | Keyframe | Line |
|---|---|---|---|---|
| 1 | 5s | `a0384fe3-9831-4c5e-91df-95190c0fdcd1` | Tom alone | "Ell? Can you come here a sec?" |
| 2 | 7s | `c0768d7d-21ac-4b65-b056-0ff67fb70f72` | establishing | "What's it doing." / "It boots into Sequoia now…" |
| 3 | 7s | `086bd0b2-6d71-4197-a541-c69ac05933f6` | over-shoulder | "It's just slower…" / "So ask Noah." |
| 4 | 5s | `a4bd00a5-cde2-47df-b12b-79db01669715` | over-shoulder | "...All of that?" / "All of that." |
| 5 | 7s | `508ccc4a-f9f6-4d8f-bf75-87c5dfdc0bd0` | over-shoulder | "Spotlight's still rebuilding…" / "Because it asked first." |
| 6 | 5s | `980cf81e-8d34-4a0f-b455-0e61cad294ef` | reaction | "Huh." / "Mm-hm." |

Spend: 4 keyframes + 6 takes, roughly 100 credits of the 2858 on the account.

## If you re-roll a take

Keep `mode: "pro"`, `sound: "on"`, and the same `start_image` job ID. Put the spoken
lines inside the prompt as quoted dialogue — that's what Kling voices. Take 2 needed a
resubmit with `declined_preset_id` after the API offered a preset ("IN THE DARK") instead
of running the job; expect that occasionally and just decline it.
